import AWS, { LexModelBuildingService } from 'aws-sdk';
import { v5 as uuid } from 'uuid';

AWS.config.update({
  region: 'us-east-1'
})

const S3 = new AWS.S3()

const BUCKET = 'ecoleta-uploads'

export const upload = (body: Express.Multer.File, name: string) => {
  const id: string = uuid(name, uuid.DNS)
  return new Promise((resolve, reject) => {
    S3.putObject({
      Bucket: BUCKET,
      Key: id + '.jpg',
      // Body: new Buffer(body.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
      Body: body,
      // ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    }, (error) => {
      if (error) {
        return reject(error)
      }
      return resolve({
        bucket: BUCKET,
        key: id + '.jpg'
      });
    })
  })
}
