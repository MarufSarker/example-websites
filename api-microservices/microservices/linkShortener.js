import validator from 'validator';
import request from 'request';
import randomstring from 'randomstring';

import ShortenedURL from "../models/shortenedURIModel";

function randomStringGenerator() {
  return randomstring.generate({
    length: 5,
    charset: 'alphanumeric'
  });
}

function validLinkHandler(req, res, finalURL, isValidLink) {
  if (!isValidLink) {
    res.json({err: 'invalid link'});
  } else {
    ShortenedURL.findOne({originalUrl: finalURL}, (err, dataOr) => {
      if (err) {
        throw err;
      }
      if (dataOr) {
        let returningStr = process.env.APP_URL + '/srt/' + dataOr.shortUrlID;
        res.json({originalUrl: dataOr.originalUrl, shortUrlID: returningStr});
      } else {
        let ranStr = randomStringGenerator();
        ShortenedURL.findOne({shortUrlID: ranStr}, (err, dataSr) => {
          if (err) {
            throw err;
          }
          if (dataSr) {
            res.json({originalUrl: dataSr.originalUrl, shortUrlID: dataSr.shortUrlID});
          } else {
            let sr = new ShortenedURL({
              originalUrl: finalURL,
              shortUrlID: ranStr
            });
            sr.save();
            let returningStr = process.env.APP_URL + '/srt/' + ranStr;
            res.json({originalUrl: finalURL, shortUrlID: returningStr});
          }
        })
      }
    });
  }
}

function linkShortener(req, res) {
  let addr = req.url;
  addr = addr.slice(13); // for /apir/ = 6, /api/srt/add/ = 13
  let isValid = validator.isURL(addr);
  let finalURL = '';
  if (addr.slice(0, 7) === 'http://') {
    finalURL = addr.slice(7)
  } else if (addr.slice(0, 8) === 'https://') {
    finalURL = addr.slice(8)
  } else {
    finalURL = addr;
    addr = 'http://' + addr;
  }

  let isValidLink = false;

  request({
    method: 'HEAD',
    uri: addr,
  }, function (error, response, body) {
    if (error) {
      isValidLink = false;
    } else if (response.statusCode === 200) {
      isValidLink = true;
    }
    validLinkHandler(req, res, finalURL, isValidLink)
  });
}

export default linkShortener;
