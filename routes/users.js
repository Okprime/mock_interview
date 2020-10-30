const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const imageThumbnail = require('image-thumbnail');

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, 'uploads');
      },
      filename: (req, file, cb) => {
            console.log(file);
            cb(null, file.fieldname + '-' + Date.now())
      }
});

const fileFilter = (req, file, cb) => {
      if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true);
      } else {
            cb(null, false);
      }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('avatar'), function (req, res, next) {
      console.log('req.body', req.file);
      // validate the upload
      if (req.file === undefined) {
            res.send({
                  code: 400,
                  message: 'no file passed'
            })
      } else {
            sharp(req.file.path).resize(200, 200).toFile('uploads/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
                  if (err) {
                        console.log(err);
                  } else {
                        console.log('resizeImage', resizeImage);
                  }
            });
            res.send({
                  code: 200,
                  message: 'file uploaded successfully',
                  image: req.file.originalname
            })
      }
});

module.exports = router;
