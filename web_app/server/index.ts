import express from 'express';

const app = express();
const PORT = 8080;

app.get('/', function (req, res) {
  res.send('GET request to homepage')
})

app.listen(PORT, () => {
  console.log(`listening on asdfsdf!${PORT}`)
});
