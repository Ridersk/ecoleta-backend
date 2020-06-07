require('dotenv/config');

import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';
import envBuilder from './config/envBuilder';

const app = express();

envBuilder();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('STATIC_URL:', process.env.STATIC_URL)
console.log('PORT:', process.env.PORT)

app.listen(process.env.PORT || 3333);
