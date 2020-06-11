require('dotenv/config');

import AWS from 'aws-sdk';
import crypto from 'crypto';

AWS.config.update({
  region: 'us-east-1'
})

const S3 = new AWS.S3();
const BUCKET = String(process.env.BUCKET_S3_NAME);
const BUCKET_URL = String(process.env.BUCKET_S3_URL);

export const upload = (file: Buffer, name: string) => {
  const hash = crypto.randomBytes(6).toString('hex');
  const filename = `${hash}-${name}`;

  return new Promise((resolve, reject) => {
    S3.putObject({
      Bucket: BUCKET,
      Key: filename,
      Body: file,
      ContentType: 'image/jpeg'
    }, (error) => {
      if (error) {
        return reject(error)
      }
      return resolve(`${BUCKET_URL}/${filename}`);
    });
  });
}
