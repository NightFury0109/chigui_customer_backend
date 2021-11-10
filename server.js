const path = require('path');
const crypto = require('crypto');

const express = require('express');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const MongoURI = require('./config/config').MongoURI;

const app = express();

const usersRoute = require('./routes/users');

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'avatars');
  },
  filename: (req, file, callback) => {
    crypto.randomBytes(20, (err, buffer) => {
      const name = Date.now() + buffer.toString('hex') + '.' + file.originalname.split('.').reverse()[0];
      callback(null, name);
    });
  }
});

const fileFilter = (req, file, callback) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (fileTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('avatar'));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

app.use('/api/users', usersRoute);

mongoose.connect(MongoURI)
  .then(() => {
    console.log('MongoDB Connected!');
    const port = process.env.PORT || 5000;
    app.listen(port, console.log(`Server is running on port: ${port}`));
  })
  .catch(err => console.log(`MongoDB Error: ${err}`));