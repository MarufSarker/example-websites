import crypto from 'crypto';
import google from 'googleapis';

import * as DataObjects from '../../data/dataObjects';
import {USERSRef, GBOOKS, GOOGLE_API_KEY} from '../../providerAPI/providerAPI.js';

let router = require('express').Router();

function hash (password) {
  return crypto.createHash('sha512').update(password).digest('hex');
}

router.post('/api/signup', function (req, res) {
  let username = req.body.username,
  password = req.body.password,
  fullname = req.body.fullname,
  email = req.body.email;

  if (!username || !password || !fullname || !email)
    return res.json({ signedIn: false, message: 'no username or password or fullname or email' });

  USERSRef.child(username).once('value', function (snapshot) {
    if (snapshot.exists()) 
      return res.json({ signedIn: false, message: 'Another User Already Exists With These Data' });
    
    let userObj = new DataObjects.USERObj();
    userObj.username = username;
    userObj.fullname = fullname;
    userObj.passwordHash = hash(password);
    userObj.email = email;

    USERSRef.child(username).set(userObj);
    userObj = {
      username: username,
      fullname: fullname,
      email: email
    };
    
    res.json({
      signedIn: 'signin',
      user: userObj
    });
  });
});

router.post('/api/signin', function (req, res) {
  let username = req.body.username,
  password = req.body.password;
  
  if (!username || !password) 
    return res.json({ signedIn: false, message: 'No Username or Password' });

  USERSRef.child(username).once('value', function (snapshot) {
    if (!snapshot.exists() || snapshot.child('passwordHash').val() !== hash(password))
      return res.json({ signedIn: false, message: 'Wrong Username or Password' });

    var user = snapshot.exportVal();
    
    user = {
      username: user.username,
      email: user.email,
      fullname: user.fullname
    };

    res.json({
      signedIn: 'signin',
      user: user
    });
  });
});

router.post('/api/signout', function (req, res) {
  res.json({
    signedIn: 'logout',
    message: 'You have been signed out'
  });
});

router.post('/api/googleapis', function (req, res) {
  let query = req.body.query;
  if (!query) 
    return res.json({ message: 'Enter Book Name!' });

  GBOOKS.volumes.list({auth: GOOGLE_API_KEY, q: query, orderBy: 'relevance'}, function(err, data) {
    if (err) {
      res.json({message: err.message})
    } else {
      if (data.items) {
        let filteredBooks = data.items.map(item => {
          let volumeInfo = item.volumeInfo;
          let resolvedBook = {
            id: item.id ? item.id : '',
            title: volumeInfo.title ? volumeInfo.title : '',
            authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : '',
            categories: volumeInfo.categories ? volumeInfo.categories.join(', ') : '',
            publisher: volumeInfo.publisher ? volumeInfo.publisher : '',
            publishedDate: volumeInfo.publishedDate ? volumeInfo.publishedDate : '',
            description: volumeInfo.description ? volumeInfo.description : '',
            pageCount: volumeInfo.pageCount ? volumeInfo.pageCount : 0,
            averageRating: volumeInfo.averageRating ? volumeInfo.averageRating : 0,
            smallThumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : '',
            thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '',
            language: volumeInfo.language ? volumeInfo.language : '',
            canonicalVolumeLink: volumeInfo.canonicalVolumeLink ? volumeInfo.canonicalVolumeLink : '',
          };
          return resolvedBook;
        });
        res.json({books: filteredBooks});
      } else {
        res.json({message: 'Error Book Name'})
      }
    }
  });
});

module.exports = router;
