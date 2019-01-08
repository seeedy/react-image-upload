const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./src/s3');

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static('./public'));
app.use(compression());
app.use(require('body-parser').json());

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
    console.log("I'm listening.");
});




// uploader is used as middleware to handle uploads on post route
app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log('POST /upload in server', req.body);
    // save to (local) server db
    db.saveFile(
        config.s3Url + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then((response) => {
            console.log('succesfully uploaded! response: ', response.rows[0]);
            // send back from db to vue to render
            res.json(response.rows[0]);
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});
