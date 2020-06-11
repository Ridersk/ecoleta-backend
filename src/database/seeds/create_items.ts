require('dotenv/config');

import Knex from "knex";

const URL_BASE_IMAGES = process.env.BUCKET_S3_URL;

console.log("Create Items", process.env.PORT)
console.log("Create Items", process.env.BUCKET_S3_NAME)
console.log("Create Items", URL_BASE_IMAGES)

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Lâmpadas', image: `${URL_BASE_IMAGES}/lampadas.svg` },
    { title: 'Pilhas e Baterias', image: `${URL_BASE_IMAGES}/baterias.svg` },
    { title: 'Papéis e Papelão', image: `${URL_BASE_IMAGES}/papeis-papelao.svg` },
    { title: 'Resíduos Eletrônicos', image: `${URL_BASE_IMAGES}/eletronicos.svg` },
    { title: 'Resíduos Orgânicos', image: `${URL_BASE_IMAGES}/organicos.svg` },
    { title: 'Óleo de Cozinha', image: `${URL_BASE_IMAGES}/oleo.svg` },
  ]);
}
