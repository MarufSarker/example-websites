import {
  USERSRef,
  SURVEYSRef,
} from '../providerAPI/providerAPI';

import {
  SURVEYObj,
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
        let surveys = user.surveys ? Object.keys(user.surveys).map(survey => {
          return {
            id: user.surveys[survey].id,
            title: user.surveys[survey].title,
          }
        }) : null;
        user = {
          username: user.username,
          fullname: user.fullname,
          surveys: surveys,
        };
        resolve(user);
      } else {
        resolve(null)
      }
    });
  });
}

export function getSurvey(id) {
  return new Promise((resolve, reject) => {
    SURVEYSRef.child(id).once('value', (snapshot) => {
      if (snapshot.exists()) {
        let allVoters = [];
        snapshot = snapshot.exportVal();
        let options = snapshot.options ? Object.keys(snapshot.options).map(option => {
          let votes = snapshot.options[option].optionVotes ? snapshot.options[option].optionVotes : null;
          let voters = snapshot.options[option].optionVotes ? Object.keys(snapshot.options[option].optionVotes) : [];
          voters.map(d => allVoters.push(d));
          votes = Object.keys(votes).length - 1;
          option = {
            optionTitle: snapshot.options[option].optionTitle,
            optionVotes: votes,
          };
          return option;
        }) : null;
        let survey = {
          id: snapshot.id,
          title: snapshot.title,
          addedBy: snapshot.addedBy,
          shares: snapshot.shares ? snapshot.shares : 0,
          options: options,
          allVoters: allVoters,
        };
        // console.log(survey);
        resolve(survey);
      } else {
        resolve(null);
      }
    });
  });
}

export function getSurveys() {
  return new Promise((resolve, reject) => {
    SURVEYSRef.child('/').once('value', (snapshot) => {
      if (snapshot.exists()) {
        snapshot = snapshot.exportVal();
        let surveys = [];
        Object.keys(snapshot).map(survey => {
          let options = snapshot[survey].options ? Object.keys(snapshot[survey].options).map(option => {
            let pseudoRoot = snapshot[survey].options[option];
            let votes = pseudoRoot.optionVotes ? Object.keys(pseudoRoot.optionVotes).length : 0;
            option = {
              optionTitle: pseudoRoot.optionTitle,
              optionVotes: votes - 1,
            };
            return option;
          }) : null;
          survey = {
            id: snapshot[survey].id,
            title: snapshot[survey].title,
            addedBy: snapshot[survey].addedBy,
            shares: snapshot[survey].shares || 0,
            options: options,
          };
          surveys.push(survey);
        });
        resolve(surveys);
      } else {
        resolve(null)
      }
    });
  });
}

export function addSurvey({username, title, options}) {
  return new Promise((resolve, reject) => {
    let id = title.toLowerCase().replace(/\s/g, '-') + '-' + username + '-' + Date.now().toString();
    SURVEYSRef.child(id).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        let pseudoOptions = {};
        options.map(option => {
          pseudoOptions[option.optionTitle.toLowerCase()] = {
            optionTitle: option.optionTitle,
            optionVotes: {
              [username]: {
                username: username,
                votedAt: Date.now(),
              }
            }
          };
        });
        let pseudoSurvey = {
          id: id,
          title: title,
          addedBy: username,
          options: pseudoOptions,
        };
        SURVEYSRef.child(id).set(pseudoSurvey, (err) => {
          if (err) {console.error(err);}
          USERSRef.child(username + '/surveys/' + id).once('value', (userSnapshot) => {
            if (!userSnapshot.exists()) {
              let us = {
                id: id,
                title: title,
              };
              USERSRef.child(username + '/surveys/' + id).set(us, (err) => {
                if (err) {console.log(err);}
                resolve({username, id});
              });
            } else {
              resolve({username, id});
            }
          });
        });
      } else {
        resolve({username, id})
      }
    });
  });
}

export function removeSurvey({username, id}) {
  return new Promise((resolve, reject) => {
    SURVEYSRef.child(id).once('value', (snapshot) => {
      if (snapshot.exists()) {
        SURVEYSRef.child(id).set(null, (err) => {
          if (err) {console.log(err);}
          USERSRef.child(username + '/surveys/' + id).once('value', (userSnapshot) => {
            if (userSnapshot.exists()) {
              USERSRef.child(username + '/surveys/' + id).set(null, (err) => {
                if (err) {console.log(err);}
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

export function voteSurvey({username, id, optionTitle}) {
  optionTitle = optionTitle.toLowerCase();
  return new Promise((resolve, reject) => {
    SURVEYSRef.child(id + '/options/' + optionTitle + '/optionVotes/' + username).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        let dt = {
          username: username,
          votedAt: Date.now(),
        };
        SURVEYSRef.child(id + '/options/' + optionTitle + '/optionVotes/' + username).set(dt, (err) => {
          if (err) {console.log(err);}
          resolve({username, id});
        });
      } else {
        resolve({username, id});
      }
    });
  });
}

export function shareSurvey({username, id}) {
  return new Promise((resolve, reject) => {
    SURVEYSRef.child(id + '/shares').once('value', (snapshot) => {
      if (!snapshot.exists()) {
        let dt = 1;
        SURVEYSRef.child(id + '/shares').set(dt, (err) => {
          if (err) {console.log(err);}
          resolve({username, id});
        });
      } else {
        let dt = snapshot.exportVal();
        dt = dt + 1;
        SURVEYSRef.child(id + '/shares').set(dt, (err) => {
          if (err) {console.log(err);}
          resolve({username, id});
        });
      }
    });
  });
}
