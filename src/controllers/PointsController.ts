import { Request, Response } from 'express';
import knex from '../database/connection';
import { upload } from '../services/s3Service';

interface ParamsMultiPart {
  image: [{
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }];
}

class PointsController {

  async index(request: Request, response: Response) {
    const { city, uf, items, latitude, longitude } = request.query;

    let parsedItems =
      String(items)
        .split(',')
        .map(item => Number(item.trim()))


    let points = [];

    points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .where('point_items.item_id', 'in', parsedItems)
      .where('points.city', city ? String(city) : knex.raw('points.city'))
      .where('points.uf', uf ? String(uf) : knex.raw('points.uf'))
      .whereRaw('ABS(points.latitude - :latitude) <= 0.1', {
        latitude: latitude ?
          Number(latitude) :
          knex.raw('points.latitude')
      }).whereRaw('ABS(points.longitude - :longitude) <= 0.1', {
        longitude: longitude
          ? Number(longitude) :
          knex.raw('points.longitude')
      }).distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point
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
      ...point
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
      items
    } = request.body;

    const { files } = request;
    const image = (files as unknown as ParamsMultiPart).image[0];
    const imageUrl = await upload(image.buffer, image.originalname);

    const trx = await knex.transaction();

    const point = {
      image: imageUrl,
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
