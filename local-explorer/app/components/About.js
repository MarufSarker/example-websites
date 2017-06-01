import React from 'react';

class About extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="h2">About</div>
        <br/>

        <div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="h3">API Sources</div>
              <div>
                This web app uses below listed data sources' api functionality -
              </div>
            </div>
            <div className="panel-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <a href="https://www.yelp.com/developers" target="_blank">Yelp Search API</a>
                </li>
              </ul>
            </div>
            <div className="panel-footer">&hearts; for all :)</div>
          </div>
        </div>

        <div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="h3">Libraries</div>
              <div>
                Along with several amazing open-source node modules, this web application uses below listed modules -
              </div>
            </div>
            <div className="panel-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <a href="https://github.com/facebook/react" target="_blank">ReactJS</a>
                </li>
                <li className="list-group-item">
                  <a href="https://github.com/facebook/relay" target="_blank">RelayJS</a>
                </li>
                <li className="list-group-item">
                  <a href="https://github.com/graphql/express-graphql" target="_blank">GraphQL Express Middleware</a>
                </li>
                <li className="list-group-item">
                  <a href="https://github.com/rackt/react-router" target="_blank">React Router</a>
                </li>
                <li className="list-group-item">
                  <a href="https://github.com/strongloop/express" target="_blank">ExpressJS</a>
                </li>
                <li className="list-group-item">
                  <a href="https://www.npmjs.com/package/firebase" target="_blank">Firebase</a>
                </li>
                <li className="list-group-item">
                  etc... :)
                </li>
              </ul>
            </div>
            <div className="panel-footer">&hearts; for all :)</div>
          </div>
        </div>

        <div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="h3">Developer</div>
              <div>
                Abu Md. Maruf Sarker
              </div>
            </div>
            <div className="panel-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <a href="https://github.com/MarufSarker" target="_blank">Github [MarufSarker]</a>
                </li>
                <li className="list-group-item">
                  <a href="https://twitter.com/iMaruf" target="_blank">Twitter [@iMaruf]</a>
                </li>
                <li className="list-group-item">
                  <a href="http://www.freecodecamp.com/MarufSarker" target="_blank">FreeCodeCamp [marufsarker]</a>
                </li>
              </ul>
            </div>
            <div className="panel-footer">&hearts;  :)</div>
          </div>
        </div>

      </div>
    );
  }
}

export default About;
