require('dotenv/config');

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errors());

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('STATIC_FILES_URL', process.env.BUCKET_S3_URL);

app.listen(process.env.PORT || 3333);
