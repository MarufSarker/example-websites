import {
  UserObj,
  ImageObj,
} from './dataObjects';

import {
  UserRef,
  ImageRef,
} from '../providerAPI/providerAPI';

export function test(data) {
  console.log('data')
  console.log(data)
}

export function getUser(username) {
  return new Promise((resolve, reject) => {
    UserRef.child(username).once('value', (snapshot) => {
      if (snapshot.exists()) {
        let user = snapshot.exportVal();
        let images = user.images ? Object.keys(user.images).map(img => user.images[img].id) : null;
        user = {
          username: user.username,
          fullname: user.fullname,
          images: images,
        };
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
}

export function getImage(id) {
  return new Promise((resolve, reject) => {
    ImageRef.child(id).once('value', (snapshot) => {
      if (snapshot.exists()) {
        let image = snapshot.exportVal();
        image = {
          id: image.id,
          title: image.title,
          imageLink: image.imageLink,
          dateAdded: image.dateAdded,
          addedBy: image.addedBy,
        };
        resolve(image);
      } else {
        resolve(null);
      }
    });
  });
}

export function getImages() {
  return new Promise((resolve, reject) => {
    ImageRef.child('/').once('value', (snapshot) => {
      if (snapshot.exists()) {
        let imagesObj = snapshot.exportVal();
        let images = [];
        Object.keys(imagesObj).map(img => {
          let singleImg = {
            id: imagesObj[img].id,
            title: imagesObj[img].title,
            imageLink: imagesObj[img].imageLink,
            dateAdded: imagesObj[img].dateAdded,
            addedBy: imagesObj[img].addedBy,
          };
          images.push(singleImg);
        });
        resolve(images);
      } else {
        resolve(null);
      }
    });
  });
}

export function getUserImages(username) {
  return new Promise((resolve, reject) => {
    UserRef.child(username).once('value', (snapshot) => {
      if (snapshot.exists()) {
        let user = snapshot.exportVal();
        let userImgs = user.images ? Object.keys(user.images).map(img => user.images[img].id) : null;
        let userImages = [];
        if (userImgs) {
          userImgs.map(id => {
            getImage(id).then(data => {
              userImages.push(data);
              if (userImages.length === userImgs.length) {
                resolve(userImages);
              }
            });
          });
        } else {
          resolve(null)
        }
      } else {
        resolve(null)
      }
    });
  });
}

export function addImage({username, title, imageLink}) {
  return new Promise((resolve, reject) => {
    let img = new ImageObj;
    let dateNow = Date.now().toString();
    img.title = title;
    img.imageLink = imageLink;
    img.dateAdded = dateNow;
    img.id = dateNow + '-' + username;
    img.addedBy = username;
    ImageRef.child(img.id).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        ImageRef.child(img.id).set(img, (err) => {
          if (err) {console.error(err);};
          UserRef.child(username + '/images/' + img.id).once('value', (usrSnapshot) => {
            if (!usrSnapshot.exists()) {
              UserRef.child(username + '/images/' + img.id).set({id: img.id, dateAdded: img.dateAdded}, (err) => {
                if (err) {console.error(err);}
                resolve({username, id: img.id});
              });
            } else {
              resolve({username, id: img.id});
            }
          });
        });
      } else {
        resolve({username, id: img.id});
      }
    });
  });
}

export function removeImage({username, id}) {
  return new Promise((resolve, reject) => {
    ImageRef.child(id).once('value', (snapshot) => {
      if (snapshot.exists()) {
        ImageRef.child(id).set(null, (err) => {
          if (err) {console.error(err);};
          UserRef.child(username + '/images/' + id).once('value', (usrSnapshot) => {
            if (usrSnapshot.exists()) {
              UserRef.child(username + '/images/' + id).set(null, (err) => {
                if (err) {console.error(err);}
                resolve({username, id});
              });
            } else {
              resolve({username, id});
            }
          });
        });
      } else {
        resolve({username, id});
      }
    });
  });
}
