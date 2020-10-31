const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require("path");

const uploadDir = `${process.cwd()}/public/images`;
if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
            cb(null, `${file.originalname}`)
      }
});

const fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
      } else {
            cb(null, false);
      }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('image'), function (req, res, next) {
      console.log('req.body', req.file);
      // validate the upload
      if (!req.file) {
            res.status(400).send({
                  code: 400,
                  message: 'no data passed'
            })
      } else {
            sharp(req.file.path).resize(100, 100).toFile(`${uploadDir}/${req.file.originalname}.t`, (err, resizeImage) => {
                  if (err) {
                        console.log(err);
                  } else {
                        console.log('resizeImage', resizeImage);
                  }
            });
            res.send({
                  code: 200,
                  message: 'file uploaded successfully',
                  image: req.file.path,
            })
      }
});

router.get('/upload', function (req, res, next) {
            fs.readdir(uploadDir, function(err, filenames) {
                  if (err) {
                        console.log(err);
                        return;
                  }
                  const thumbnail = [];
                  const original = [];
                  filenames.forEach(function(filename) {
                        if (filename.endsWith('t')) {
                              console.log('filename', filename);
                              thumbnail.push(`${uploadDir}/${filename}`)
                        } else {
                              original.push(`${uploadDir}/${filename}`)
                        }
                  });
                  console.log('original', original);
                  console.log('thumbnail', thumbnail);
                  const finalObj = [];
                  for (const value of original) {
                        const result = value.split('/')[4];
                        console.log('result', result);
                        for (const data of thumbnail) {
                              if (result.charAt(0) === data.split('/')[4].charAt(0)) {
                                    const obj = {
                                          original: value,
                                          thumbnail: data
                                    };
                                    finalObj.push(obj)
                              }
                        }
                  }
                  console.log('finalObj', finalObj);
                  res.send({
                        message: 'Data successfully fetched',
                        data: finalObj
                  })
            });
});

module.exports = router;
