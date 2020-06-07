import { Request, Response } from 'express';
import knex from '../database/connection';
import { upload } from '../services/s3Service';

class PointsController {

  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    let parsedItems = items ?
      String(items)
        .split(',')
        .map(item => Number(item.trim()))
      : knex.raw('select id from items');


    let points = [];

    if (!city && !uf && !items) {
      points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .distinct()
        .select('points.*');
    } else {
      points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .where('point_items.item_id', 'in', parsedItems)
        .where('points.city', city ? String(city) : knex.raw('points.city'))
        .where('points.uf', uf ? String(uf) : knex.raw('points.uf'))
        .distinct()
        .select('points.*');
    }


    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `${process.env.STATIC_URL}/uploads/${point.image}`
      };
    });

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const serializedPoint = {
      ...point,
      image_url: `${process.env.STATIC_URL}/uploads/${point.image}`
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
      image
    } = request.body;

    upload(image, "")

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id
        }
      });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point
    });
  }
}

export default PointsController;
