const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {getData} = require('../data/service.js');
const {insertItem} = require('../data/service.js');
const {deleteItem} = require('../data/service.js');

router.get('/', async (req, res) => {
  const minX = req.query.minx;
  const maxX = req.query.maxx;
  const minY = req.query.miny;
  const maxY = req.query.maxy;
  const data = await getData(minX, minY, maxX, maxY);
  res.json({"message": "ok!", data});
});

router.post('/', async (req, res) => {
  const newItem = req.body;
  let tmp = '';
  newItem.image = '/photos/default.jpeg';
  if ((req.files) &&
    ((req.files.image.mimetype === 'image/jpeg') ||
      (req.files.image.mimetype === 'image/png'))) {
    const imageExt = req.files.image.name.split('.')[1];
    tmp = path.resolve(__dirname);
    tmp = tmp.split('/');
    tmp.pop();
    tmp = tmp.join('/');
    let imageName = uuidv4() + '.' + imageExt;
    const imagePath = tmp + '/static/photos/' + imageName;
    req.files.image.mv(imagePath, (error) => {
      return;
    });
    newItem.image = '/photos/' + imageName;
  }
  const item = await insertItem(newItem);
  res.json({"message": "ok!", item});
});

router.post('/:id', async (req, res) => {
  const id = req.params.id;
  const image = await deleteItem(id);
  if (image && (image !== '/photos/default.jpeg')) {
    let tmp = path.resolve(__dirname);
    tmp = tmp.split('/');
    tmp.pop();
    tmp = tmp.join('/');
    tmp = tmp + '/static' + image;
    try {
      fs.rm(tmp, (error) => {
        if (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log('Error remove file.');
      console.log(error.message);
    }
  }
  res.json({"message": "Item deleted.", id});
});

module.exports = router;
