import Knex from "knex";

const URL_S3 = 'https://ecoleta-uploads.s3.amazonaws.com';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Lâmpadas', image: `${URL_S3}/lampadas.svg` },
    { title: 'Pilhas e Baterias', image: `${URL_S3}/baterias.svg` },
    { title: 'Papéis e Papelão', image: `${URL_S3}/papeis-papelao.svg` },
    { title: 'Resíduos Eletrônicos', image: `${URL_S3}/eletronicos.svg` },
    { title: 'Resíduos Orgânicos', image: `${URL_S3}/organicos.svg` },
    { title: 'Óleo de Cozinha', image: `${URL_S3}/oleo.svg` },
  ]);
}
