import {
  USERS,
  BUSINESSES,
} from '../providerAPI/providerAPI';

import {
  Business,
} from './dataObjects';

export function getViewer() {
  return {};
}

export function getUser(username) {
  return new Promise((resolve, reject) => {
    USERS.child(username).once('value', function (snapshot) {
      if (snapshot.exists()) {
        var user = snapshot.exportVal();
        user = {
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          attendingLocations: user.attendingLocations || null,
        };
        resolve(user);
      } else {
        resolve(null)
      }
    });
  });
}

export function getPseudoUser(attendees) {
  return new Promise((resolve, reject) => {
    let resolvedAttendees = [];
    attendees.map(attendee => {
      USERS.child(attendee).once('value', function (snapshot) {
        let user = snapshot.exportVal();
        user = {
          fullname: user.fullname,
        };
        resolvedAttendees.push(user);
        if (resolvedAttendees.length === attendees.length) {
          resolve(resolvedAttendees);
        }
      });
    });
  });
}

export function getPseudoBusinesses(businesses) {
  return new Promise((resolve, reject) => {
    let resolvedBusinesses = [];
    businesses.map(business => {
      getBusiness(business).then(data => {
        resolvedBusinesses.push(data);
        if (resolvedBusinesses.length === businesses.length) {
          resolve(resolvedBusinesses);
        }
      })
    });
  });
}

export function getBusiness(id) {
  return new Promise((resolve, reject) => {
    BUSINESSES.child(id).once('value', function (snapshot) {
      if (snapshot.exists()) {
        var business = snapshot.exportVal();
        business = {
          id: business.id || null,
          name: business.name || null, 
          rating: business.rating || null, 
          rating_img_url_small: business.rating_img_url_small || null, 
          review_count: business.review_count || null, 
          url: business.url || null, 
          category: business.category || null, 
          snippet_text: business.snippet_text || null, 
          image_url: business.image_url || null, 
          snippet_image_url: business.snippet_image_url || null, 
          is_closed: business.is_closed || null, 
          location: business.location || null, 
          display_phone: business.display_phone || null,
          attendees: business.attendees || null,
        };
        resolve(business);
      } else {
        resolve(null)
      }
    });
  });
}

export function addLocation({username, id, name, rating, rating_img_url_small, review_count, url, category, snippet_text, image_url, snippet_image_url, is_closed, location, display_phone}) {
  return new Promise((resolve, reject) => {
    BUSINESSES.child(id).once('value', snapshot => {
      if (!snapshot.exists()) {
        let business = new Business();
        is_closed = is_closed.toString() || null;
        business = {
          id: id || null,
          name: name || null, 
          rating: rating || null, 
          rating_img_url_small: rating_img_url_small || null, 
          review_count: review_count || null, 
          url: url || null, 
          category: category || null, 
          snippet_text: snippet_text || null, 
          image_url: image_url || null, 
          snippet_image_url: snippet_image_url || null, 
          is_closed: is_closed || null, 
          location: location || null, 
          display_phone: display_phone || null,
          attendees: {[username]: {username}}
        };
        
        BUSINESSES.child(id).set(business, (err) => {
          if (err) {console.error(err);}
          USERS.child(username + '/attendingLocations/' + id).once('value', function(locSnapshot) {
            if (!locSnapshot.exists()) {
              USERS.child(username + '/attendingLocations/' + id).set({id}, function(err) {
                if (err) {console.error(err);}
                resolve({username});
              });
            } else {
              resolve({username});
            }
          });
        });
      } else if (snapshot.exists()) {
        BUSINESSES.child(id + '/attendees/' + username).once('value', userSnapshot => {
          if (!userSnapshot.exists()) {
            BUSINESSES.child(id + '/attendees/' + username).set({username}, (err) => {
              if (err) {console.error(err);}
              USERS.child(username + '/attendingLocations/' + id).once('value', function(locSnapshot) {
                if (!locSnapshot.exists()) {
                  USERS.child(username + '/attendingLocations/' + id).set({id}, function(err) {
                    if (err) {console.error(err);}
                    resolve({username});
                  });
                } else {
                  resolve({username});
                }
              });
            });
          } else {
            resolve({username});
          }
        });
      }
    });
  });
}

export function removeLocation({username, id}) {
  return new Promise((resolve, reject) => {
    BUSINESSES.child(id + '/attendees/' + username).once('value', snapshot => {
      if (snapshot.exists()) {
        BUSINESSES.child(id + '/attendees/' + username).set(null, (err) => {
          if (err) {console.error(err);}
          BUSINESSES.child(id + '/attendees').once('value', snapshot => {
            if (!snapshot.exists()) {
              BUSINESSES.child(id).set(null, (err) => {
                if(err) {console.error(err);}
                USERS.child(username + '/attendingLocations/' + id).once('value', snapshot => {
                  if (snapshot.exists()) {
                    USERS.child(username + '/attendingLocations/' + id).set(null, (err) => {
                      if (err) {console.error(err);}
                      resolve({username});
                    });
                  } else {
                    resolve({username});
                  }
                });
              });
            } else {
              USERS.child(username + '/attendingLocations/' + id).once('value', snapshot => {
                if (snapshot.exists()) {
                  USERS.child(username + '/attendingLocations/' + id).set(null, (err) => {
                    if(err) {console.error(err);}
                    resolve({username});
                  });
                } else {
                  resolve({username});
                }
              });
            }
          });
        });
      } else {
        resolve({username});
      }
    });
  });
}
