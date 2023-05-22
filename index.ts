import { app } from './src/app';

const port = process.argv.slice(2)[0];

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
