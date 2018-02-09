// var photos = []
var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

// photos.push({
//   name: 'Node.js Logo',
//   path: 'http://nodejs.org/images/logos/nodejs-green.png'
// })
// photos.push({
//   name: 'Ryan Speaking',
//   path: 'http://nodejs.org/images/ryan-speaker.jpg'
// })

// exports.list = function (req, res) {
//   res.render('index', {
//     title: 'Photos',
//     photos: photos
//   })
// }
exports.list = function(req, res, next){
  Photo.find({}, function(err, photos){
    if (err) return next(err);
    res.render('photos', {
      title: 'Photos',
      photos: photos
    });
  });
};

exports.form = function (req, res) {
  res.render('upload', {
    title: 'Photo upload'
  })
}

exports.submit = function (dir) {
  return function(req, res, next){
    console.log(req.files);
    var img = req.files.photo.image;
    var name = req.body.photo.name || img.name;
    var path = join(dir, img.name);

    fs.rename(img.path, path, function(err){
      if (err) return next(err);

      Photo.create({
        name: name,
        path: img.name
      }, function(err) {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  };
};

// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('photo', {
//     title: 'Photos',
//     photos: photos
//   })
// })

// module.exports = router;

