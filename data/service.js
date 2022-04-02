const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function dbRequest(db, sql) {
  return new Promise((resolve, reject) => {
    try {
      db.all(sql, [], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    } catch(error) {
      reject(error);
    }
  });
}

function dbGet(db, sql) {
  return new Promise((resolve, reject) => {
    try {
      db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    } catch(error) {
      reject(error);
    }
  });
}

function dbRun(db, sql) {
  return new Promise((resolve, reject) => {
    try {
      db.run(sql, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    } catch(error) {
      reject(error);
    }
  });
}

async function getData(minX, minY, maxX, maxY) {
  const db = new sqlite3.Database(path.resolve(__dirname) + '/db/estate.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  const sql = `select * from estate where (lon between ${minX} and ${maxX})
    and (lat between ${minY} and ${maxY}) ;`;
  const result = await dbRequest(db, sql).then();
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  return result;
};

async function insertItem(item) {
  const db = new sqlite3.Database(path.resolve(__dirname) + '/db/estate.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  let sql = `select max(id) as value from estate`;
  const id = await dbGet(db, sql).then();
  item.id = id.value + 1;
  sql = `insert into estate(
    id, name, description, image, lat, lon, country, state, city, borough,
    district, house_number, road, suburb) values(
    ${item.id}, '${item.name}', '${item.description}', '${item.image}', ${item.lat},
    ${item.lon}, '${item.country}', '${item.state}', '${item.city}', '${item.borough}',
    '${item.district}', '${item.house_number}', '${item.road}', '${item.suburb}');`;
  await dbRun(db, sql).then();
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  return item;
};

async function deleteItem(id) {
  const db = new sqlite3.Database(path.resolve(__dirname) + '/db/estate.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  let sql = `select image from estate where id = ${id}`;
  const {image} = await dbGet(db, sql).then();
  sql = `delete from estate where id = ${id}`;
  await dbRun(db, sql).then();
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  return image;
}

module.exports = {
  getData,
  insertItem,
  deleteItem
};
