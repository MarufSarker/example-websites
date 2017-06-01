import {
  USERSRef,
  BOOKSRef,
  INDEXRef,
} from '../providerAPI/providerAPI';

import {
  BOOKObj,
  REQUESTObj,
} from './dataObjects';

export function getViewer() {
  return {};
}

export function test(data) {
  console.log(data)
  console.log(typeof(data))
}

export function getUser(username) {
  return new Promise((resolve, reject) => {
    USERSRef.child(username).once('value', function (snapshot) {
      if (snapshot.exists()) {
        let user = snapshot.exportVal();
        let books = user.books ? Object.keys(user.books).map(book => {
          return {
            id: user.books[book].id,
            available: user.books[book].available,
          }
        }) : null;
        let pseudoRequests = [];
        user.requests ? Object.keys(user.requests).map(book => {
          Object.keys(user.requests[book]).map(usr => {
            pseudoRequests.push({
              id: book,
              username: user.requests[book][usr].username
            }); 
          });
        }) : null;
        let pseudoPendings = [];
        user.pendings ? Object.keys(user.pendings).map(book => {
          Object.keys(user.pendings[book]).map(usr => {
            pseudoPendings.push({
              id: book,
              username: user.pendings[book][usr].username
            }); 
          });
        }) : null;
        let pseudoBorrows = [];
        user.borrows ? Object.keys(user.borrows).map(book => {
          Object.keys(user.borrows[book]).map(usr => {
            pseudoBorrows.push({
              id: book,
              username: user.borrows[book][usr].username
            }); 
          });
        }) : null;
        let pseudoAcceptedRequests = [];
        user.acceptedrequests ? Object.keys(user.acceptedrequests).map(book => {
          Object.keys(user.acceptedrequests[book]).map(usr => {
            pseudoAcceptedRequests.push({
              id: book,
              username: user.acceptedrequests[book][usr].username
            }); 
          });
        }) : null;
        user = {
          username: user.username,
          fullname: user.fullname,
          books: books,
          requests: pseudoRequests,
          pendings: pseudoPendings,
          borrows: pseudoBorrows,
          acceptedrequests: pseudoAcceptedRequests,
        };
        resolve(user);
      } else {
        resolve(null)
      }
    });
  });
}

export function getBook(id) {
  return new Promise((resolve, reject) => {
    BOOKSRef.child(id).once('value', function (snapshot) {
      snapshot = snapshot.exportVal();
      snapshot.addedBy = Object.keys(snapshot.addedBy).map(adder => {
        return snapshot.addedBy[adder];
      });
      resolve(snapshot);
    })
  })
}

export function getBooks() {
  return new Promise((resolve, reject) => {
    BOOKSRef.child('/').once('value', (snapshot) => {
      if (snapshot.exists()) {
        snapshot = snapshot.exportVal();
        snapshot = Object.keys(snapshot).map(singleBook => {
          snapshot[singleBook].addedBy = Object.keys(snapshot[singleBook].addedBy).map(adder => {
            return snapshot[singleBook].addedBy[adder];
          });
          return snapshot[singleBook];
        });
        resolve(snapshot);
      } else {
        resolve(null)
      }
    });
  });
}

export function addBook({username, id, title, authors, categories, publisher, publishedDate, description, pageCount, averageRating, smallThumbnail, thumbnail, language, canonicalVolumeLink}) {
  // console.log('here');
  return new Promise((resolve, reject) => {
    var bookObj = new BOOKObj();
    bookObj = {
      id: id, 
      title: title,
      authors: authors,
      categories: categories,
      publisher: publisher,
      publishedDate: publishedDate,
      description: description,
      pageCount: pageCount,
      averageRating: averageRating,
      smallThumbnail: smallThumbnail,
      thumbnail: thumbnail,
      language: language,
      canonicalVolumeLink: canonicalVolumeLink,
    };
    BOOKSRef.child(id).once('value', function (snapshot) {
      if (!snapshot.exists()) {
        BOOKSRef.child(id).set(bookObj, function(error) {
          if (error) { console.error(error);}
          BOOKSRef.child(id + '/addedBy/' + username).once('value', snapshot => {
            BOOKSRef.child(id + '/addedBy/' + username).set({username, available: 'available'}, (err) => {
              if (err) {console.error(err);}
              USERSRef.child(username + '/books/' + id).once('value', function(snapshot) {
                if (!snapshot.exists()) {
                  USERSRef.child(username + '/books/' + id).set({id, available: 'available'}, function(err) {
                    if (err) {console.error(err);}
                    INDEXRef.child(id).set({title: title}, (err) => {
                      if (err) {console.log(err);}
                      resolve({username, id});
                    });
                  });
                } else {
                  INDEXRef.child(id).set({title: title}, (err) => {
                    if (err) {console.log(err);}
                    resolve({username, id});
                  });
                }
              });
            });
          });
        });
      } else {
        BOOKSRef.child(id + '/addedBy/' + username).once('value', snapshot => {
          if(!snapshot.exists()) {
            BOOKSRef.child(id + '/addedBy/' + username).set({username, available: 'available'}, (err) => {
              if (err) {console.error(err);}
              USERSRef.child(username + '/books/' + id).once('value', function(snapshot) {
                if (!snapshot.exists()) {
                  USERSRef.child(username + '/books/' + id).set({id, available: 'available'}, function(err) {
                    if (err) {console.error(err);}
                    INDEXRef.child(id).set({title: title}, (err) => {
                      if (err) {console.log(err);}
                      resolve({username, id});
                    });
                  });
                } else {
                  INDEXRef.child(id).set({title: title}, (err) => {
                    if (err) {console.log(err);}
                    resolve({username, id});
                  });
                }
              });
            });
          } else {
            resolve({username, id});
          }
        });
      }
    });
  });
}

export function removeBook({username, id}) {
  return new Promise((resolve, reject) => {
    BOOKSRef.child(id + '/addedBy/' + username).once('value', snapshot => {
      if (snapshot.exists()) {
        BOOKSRef.child(id + '/addedBy/' + username).set(null, err => {
          if (err) {console.error(err);}
          BOOKSRef.child(id + '/addedBy').once('value', snapshot => {
            if (!snapshot.exists()) {
              BOOKSRef.child(id).set(null, err => {
                if(err) {console.error(err);}
                INDEXRef.child(id).set(null, (err) => {
                  if (err) {console.log(err);}
                  USERSRef.child(username + '/books/' + id).once('value', snapshot => {
                    if (snapshot.exists()) {
                      USERSRef.child(username + '/books/' + id).set(null, err => {
                        if(err) {console.log(err);}
                        resolve({username});
                      });
                    } else {
                      resolve({username});
                    }
                  });
                });
              });
            } else {
              USERSRef.child(username + '/books/' + id).once('value', snapshot => {
                if (snapshot.exists()) {
                  USERSRef.child(username + '/books/' + id).set(null, err => {
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

export function addRequest({username, id, bookOwner}) {
  return new Promise((resolve, reject) => {
    BOOKSRef.child(id + '/addedBy/' + bookOwner).once('value', snapshot => {
      if (snapshot.exists()) {
        BOOKSRef.child(id + '/addedBy/' + bookOwner + '/available').set('notavailable', err => {
          if (err) {console.log(err);}
          USERSRef.child(bookOwner + '/requests/' + id + '/' + username).once('value', urSnapshot => {
            if (!urSnapshot.exists()) {
              USERSRef.child(bookOwner + '/requests/' + id + '/' + username).set({username: username}, err => {
                if (err) {console.log(err);}
                USERSRef.child(username + '/pendings/' + id + '/' + bookOwner).once('value', bbSnapshot => {
                  if (!bbSnapshot.exists()) {
                    USERSRef.child(username + '/pendings/' + id + '/' + bookOwner).set({username: bookOwner}, err => {
                      if (err) {console.log(err);}
                      resolve({username})
                    });
                  } else {
                    resolve({username})
                  }
                });
              });
            } else {
              resolve({username})
            }
          });
        });
      } else {
        resolve({username})
      }
    });
  });
}

export function removeRequest({username, id, bookOwner}) {
  return new Promise((resolve, reject) => {
    BOOKSRef.child(id + '/addedBy/' + bookOwner).once('value', snapshot => {
      if (snapshot.exists()) {
        BOOKSRef.child(id + '/addedBy/' + bookOwner + '/available').set('available', err => {
          if (err) {console.log(err);}
          USERSRef.child(bookOwner + '/requests/' + id + '/' + username).once('value', urSnapshot => {
            if (urSnapshot.exists()) {
              USERSRef.child(bookOwner + '/requests/' + id + '/' + username).set(null, err => {
                if (err) {console.log(err);}
                USERSRef.child(username + '/pendings/' + id + '/' + bookOwner).once('value', bbSnapshot => {
                  if (bbSnapshot.exists()) {
                    USERSRef.child(username + '/pendings/' + id + '/' + bookOwner).set(null, err => {
                      if (err) {console.log(err);}
                      resolve({username})
                    });
                  } else {
                    resolve({username})
                  }
                });
              });
            } else {
              resolve({username})
            }
          });
        });
      } else {
        resolve({username})
      }
    });
  });
}

export function responseRequest({username, requestedBy, id, response}) {
  return new Promise((resolve, reject) => {
    if (response) {
      BOOKSRef.child(id + '/addedBy/' + username).once('value', snapshot => {
        if (snapshot.exists()) {
          BOOKSRef.child(id + '/addedBy/' + username + '/available').set('notavailable', err => {
            if (err) {console.log(err);}
            USERSRef.child(username + '/acceptedrequests/' + id + '/' + requestedBy).once('value', uarSnapshot => {
              if (!uarSnapshot.exists()) {
                USERSRef.child(username + '/acceptedrequests/' + id + '/' + requestedBy).set({username: requestedBy}, err => {
                  if (err) {console.log(err);}
                  USERSRef.child(username + '/requests/' + id + '/' + requestedBy).set(null, err => {
                    if (err) {console.log(err);}
                    USERSRef.child(requestedBy + '/borrows/' + id + '/' + username).once('value', bbSnapshot => {
                      if (!bbSnapshot.exists()) {
                        USERSRef.child(requestedBy + '/borrows/' + id + '/' + username).set({username: username}, err => {
                          if (err) {console.log(err);}
                          USERSRef.child(requestedBy + '/pendings/' + id + '/' + username).set(null, err => {
                            if(err) {console.log(err);}
                            resolve({username})
                          });
                        });
                      } else {
                        resolve({username})
                      }
                    });
                  });
                });
              } else {
                resolve({username})
              }
            });
          });
        } else {
          resolve({username})
        }
      });
    } else {
      BOOKSRef.child(id + '/addedBy/' + username).once('value', snapshot => {
        if (snapshot.exists()) {
          BOOKSRef.child(id + '/addedBy/' + username + '/available').set('available', err => {
            if (err) {console.log(err);}
            USERSRef.child(username + '/requests/' + id + '/' + requestedBy).once('value', urSnapshot => {
              if (urSnapshot.exists()) {
                USERSRef.child(username + '/requests/' + id + '/' + requestedBy).set(null, err => {
                  if (err) {console.log(err);}
                  USERSRef.child(requestedBy + '/pendings/' + id + '/' + username).once('value', bbSnapshot => {
                    if (bbSnapshot.exists()) {
                      USERSRef.child(requestedBy + '/pendings/' + id + '/' + username).set(null, err => {
                        if (err) {console.log(err);}
                        resolve({username})
                      });
                    } else {
                      resolve({username})
                    }
                  });
                });
              } else {
                resolve({username})
              }
            });
          });
        } else {
          resolve({username})
        }
      });
    }
  });
}


export function returnBook({username, bookOwner, id}) {
  return new Promise((resolve, reject) => {
    BOOKSRef.child(id + '/addedBy/' + bookOwner).once('value', snapshot => {
      if (snapshot.exists()) {
        BOOKSRef.child(id + '/addedBy/' + bookOwner + '/available').set('available', err => {
          if (err) {console.log(err);}
          USERSRef.child(bookOwner + '/acceptedrequests/' + id + '/' + username).once('value', urSnapshot => {
            if (urSnapshot.exists()) {
              USERSRef.child(bookOwner + '/acceptedrequests/' + id + '/' + username).set(null, err => {
                if (err) {console.log(err);}
                USERSRef.child(username + '/borrows/' + id + '/' + bookOwner).once('value', bbSnapshot => {
                  if (bbSnapshot.exists()) {
                    USERSRef.child(username + '/borrows/' + id + '/' + bookOwner).set(null, err => {
                      if (err) {console.log(err);}
                      resolve({username})
                    });
                  } else {
                    resolve({username})
                  }
                });
              });
            } else {
              resolve({username})
            }
          });
        });
      } else {
        resolve({username})
      }
    });
  });
}


function occurrences(bookTitle, searchTerm, allowOverlapping) {
  bookTitle += "";
  bookTitle = bookTitle.toLowerCase();
  searchTerm += "";
  searchTerm = searchTerm.toLowerCase();
  if (searchTerm.length <= 0) {
    return 0;
  }
  let count = 0,
      pos = 0,
      step = allowOverlapping ? 1 : searchTerm.length;
  while (true) {
      pos = bookTitle.indexOf(searchTerm, pos);
      if (pos >= 0) {
          ++count;
          pos += step;
      } else break;
  }
  return count;
}

function sortNumberedObjectKeys(object) {
  let objectKeys = Object.keys(object);
  let longestNumberLength = 0;
  objectKeys.map(key => {
    key += '';
    if (key.length > longestNumberLength) {
      longestNumberLength = key.length;
    }
  });
  objectKeys = objectKeys.map(key => {
    key += '';
    let requiredZeros = longestNumberLength - key.length;
    for (let i = 0; i < requiredZeros; i++) {
      key = '0' + key;
    }
    return key;
  });
  // console.log(objectKeys)
  return objectKeys;
}

export function getSearchResults(searchTerm) {
  return new Promise((resolve, reject) => {
    INDEXRef.child('/').once('value', (snapshot) => {
      if (snapshot.exists()) {
        let searchResults = {};
        let finalSearchResults = [];
        let pseudoFinalSearchResults = [];
        snapshot = snapshot.exportVal();
        Object.keys(snapshot).map(bookID => {
          let count = occurrences(snapshot[bookID].title, searchTerm);
          if (count > 0) {
            if (!searchResults[count]) {
              searchResults[count] = {};
            }
            if (!searchResults[count][bookID]) {
              searchResults[count][bookID] = {
                [bookID]: {
                  id: bookID,
                  title: snapshot[bookID].title,
                }
              };
            }
          }
        });
        let sortedSerchResultsKey = sortNumberedObjectKeys(searchResults);
        sortedSerchResultsKey.map(key => {
          Object.keys(searchResults[key]).map(bookID => {
            pseudoFinalSearchResults.push(bookID);
          });
        });
        resolve(pseudoFinalSearchResults);
      } else {
        resolve(null)
      }
    });
  });
}
