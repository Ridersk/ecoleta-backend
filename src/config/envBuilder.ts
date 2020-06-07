const build = () => {
  process.env.PORT = process.env.PORT ? process.env.PORT : "3333"
  process.env.STATIC_URL = process.env.NODE_ENV == "production" ? "https://ecoleta-rocketseat.herokuapp.com" : `http://localhost:${process.env.PORT}`
}

export default build;
