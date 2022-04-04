const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const router = require('./router/api.js');
const sqlite3 = require('sqlite3').verbose();

// create table if not exists
const db = new sqlite3.Database('./data/db/estate.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
});
let sql = `create table if not exists estate(
  id integer primary key,
  name text default null,
  description text default null,
  image text default null,
  lat real,
  lon real,
  country text default null,
  state text default null,
  city text default null,
  borough text default null,
  district text default null,
  house_number text default null,
  road text default null,
  suburb text default null
);`;
db.run(sql);
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
});

const app = express();

const PORT = process.env.PORT || 80;

app.use(cors());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname) + '/static'));

app.use('/api', router);

//404
app.all('*', (req, res) => {
  res.status(404).send('Page not found :-(');
});


app.listen(PORT, () =>{
  console.log('Server is runnig on port ' + PORT.toString() + '...');
});
