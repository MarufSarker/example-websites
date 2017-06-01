import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';

import { searchImage } from '../providerAPI/providerAPI';
import { latestSearhHandler } from '../microservices/seacrhEntryHandler';
import DateFormatter from '../microservices/dateFormatter';
import linkShortener from '../microservices/linkShortener';
import linkRedirector from '../microservices/linkRedirector';

import staticRoutes from './staticRoutes';

dotenv.load();

let PORT = process.env.PORT || 3000;
let mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, function (err, res) {
  if (err) console.log ('ERROR connecting to: ' + mongoURI + '. ' + err);
  else console.log ('Succeeded connected to: ' + mongoURI);
});

let app = express();

// expressjs plugins configurations
app.set('trust proxy', 'loopback');
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(staticRoutes);

/*TimeStamp API*/
app.get('/api/time/:timestamp', (req, res) => {
  let receivedTimestamp = req.params.timestamp; /* string */
  res.send(DateFormatter(receivedTimestamp))
});

app.post('/api/time/post', (req, res) => {
  let receivedTimestamp = req.body.timestamp;
  res.send(DateFormatter(receivedTimestamp))
});



/*Request Header API*/
app.get('/api/whoami', (req, res) => {
  let ip = req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
  let lang = req.headers['accept-language'].split(",")[0];
  let userAgent = req.headers['user-agent'];
  userAgent = userAgent.substring(userAgent.indexOf("(") + 1, userAgent.indexOf(")"));

  res.json({
    ipAdress: ip,
    language: lang,
    userAgent
  })
});

/*URL API*/
app.get('/api/srt/add/:addr*', (req, res) => {
  linkShortener(req, res);
});

app.get('/api/srt/red/:addr*', (req, res) => {
  linkRedirector(req, res)
});

/*File metadata API*/
let uploadingStorage = multer.memoryStorage();
let upload = multer({ storage: uploadingStorage });

app.post('/upload', upload.single('uploadedFile'), (req, res) => {
  if (req.file) {
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
  } else {
    res.json({
      name: 'No File',
      type: 'none',
      size: 'null',
    });
  }
});

/*Image Search API*/
app.get('/api/img/search/:searchTerm', (req, res) => {
  searchImage(req, res);
});

app.get('/api/img/latest', (req, res) => {
  latestSearhHandler(req, res);
});


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', express.static('../public'));

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`App is running at port http://localhost:${PORT}`);
});
