import crypto from 'crypto';

import * as DataObjects from '../../data/dataObjects';

import {
  UserRef,
} from '../../providerAPI/providerAPI';

function hash (password) {
  return crypto.createHash('sha512').update(password).digest('hex');
}

let router = require('express').Router();

// Sign-up
router.post('/api/signup', function (req, res) {
  let username = req.body.username,
  password = req.body.password,
  fullname = req.body.fullname,
  email = req.body.email;

  if (!username || !password || !fullname || !email)
    return res.json({ signedIn: false, message: 'no username or password or fullname or email' });

  UserRef.child(username).once('value', function (snapshot) {
    if (snapshot.exists()) 
      return res.json({ signedIn: false, message: 'Another User Already Exists With These Data' });
    
    let userObj = new DataObjects.UserObj();
    userObj.username = username;
    userObj.fullname = fullname;
    userObj.passwordHash = hash(password);
    userObj.email = email;
    
    UserRef.child(username).set(userObj);
    userObj = {
      username: username,
      fullname: fullname,
    };
    
    res.json({
      signedIn: 'signin',
      user: userObj
    });
  });
});

// Sign-in
router.post('/api/signin', function (req, res) {
  let username = req.body.username,
  password = req.body.password;

  if (!username || !password) 
    return res.json({ signedIn: false, message: 'No Username or Password' });

  UserRef.child(username).once('value', function (snapshot) {
    if (!snapshot.exists() || snapshot.child('passwordHash').val() !== hash(password))
      return res.json({ signedIn: false, message: 'Wrong Username or Password' });

    let user = snapshot.exportVal();
    user = {
      username: user.username,
      fullname: user.fullname
    };
    
    res.json({
      signedIn: 'signin',
      user: user
    });
  });
});

// Sign-out
router.post('/api/signout', function (req, res) {
  
  res.json({
    signedIn: 'logout',
    message: 'You have been signed out'
  });
});

module.exports = router;
