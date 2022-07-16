const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const { log } = require('console');

console.log(app.get('env'));
// log(process.env.NODE_ENV);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
