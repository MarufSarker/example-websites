import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';

import * as API from '../API';
import ResultsDisplay from './ResultsDisplay';

import AddLocationMutation from '../mutations/AddLocationMutation';

class Home extends React.Component {
  state = {
    catErrorMessage: '',
    locErrorMessage: '',
    requestErrorMessage: '',
    resolvedData: [],
    userPlaces: [],
  };
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.category_filter).focus();
  };
  onSearch = (evt) => {
    evt.preventDefault();

    let category_filter = ReactDOM.findDOMNode(this.refs.category_filter).value;
    let location = ReactDOM.findDOMNode(this.refs.location).value;

    if (category_filter.length === 0) {
      this.setState({
        catErrorMessage: 'Your desired type of food or restaurants is required :)',
      });
      if (location.length === 0) {
        this.setState({
          locErrorMessage: 'Your desired location is required :)',
        });
      } else {
        this.setState({
          locErrorMessage: '',
        });
      }
    }
    if (location.length === 0) {
      this.setState({
        locErrorMessage: 'Your desired location is required :)',
      });
      if (category_filter.length === 0) {
        this.setState({
          catErrorMessage: 'Your desired type of food or restaurants is required :)',
        });
      } else {
        this.setState({
          catErrorMessage: '',
        });
      }
    }
    if (category_filter.length !== 0 && location.length !== 0) {
      let userPlaces = [];
      if (this.props.user) {
        if (this.props.user.attendingLocations) {
          this.props.user.attendingLocations.map(loc => {
            userPlaces.push(loc.url);
          });
        }
      }
      this.setState({
        locErrorMessage: '',
        catErrorMessage: '',
        userPlaces: userPlaces,
      });
      API.searchBusiness(location, category_filter).then(data => {
        data = data.data;
        if (data.text) {
          this.setState({requestErrorMessage: data.text});
        } else {
          this.setState({
            requestErrorMessage: '',
            resolvedData: data,
          });
          // console.log(this.state.resolvedData)
        }
      });

    }
  };
  handleAddPlace = (data) => {
    if (!this.props.appProps.user) {
      this.props.appProps.history.pushState(null, '/login');
    } else if (this.props.appProps.user) {
      Relay.Store.update(
        new AddLocationMutation({
          data,
          user: this.props.user,
        })
      );
    }
  };
  render() {
    // console.log(this.state.userPlaces)
    return (
      <div className='container'>
        <form className="form-horizontal">
          <div className="form-group">
            <div className="col-sm-10 col-sm-offset-1">
              <input
                type="text"
                className="form-control input-lg"
                ref="category_filter"
                placeholder="Type of Food or Restaurants"/>
              <span>{this.state.catErrorMessage}</span>
              <br/>
              <input
                type="text"
                className="form-control input-lg"
                ref="location"
                placeholder="Your Location"/>
              <span>{this.state.locErrorMessage}</span>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-10 col-sm-offset-1">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                onClick={this.onSearch}>
                Search
              </button>
            </div>
          </div>
        </form>
        <div>
          {this.state.requestErrorMessage}
        </div>
        <div className="container">
          <div className="row">
          {
            this.state.resolvedData.map(datum => {
              return (
                <div key={datum.id} className="result col-sm-11">
                  <ResultsDisplay
                    data={datum}
                    handleAddPlace={this.handleAddPlace}
                    userPlaces={this.state.userPlaces}/>
                </div>
              );
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
        email,
        fullname,
        attendingLocations {
          id,
          name,
          rating,
          rating_img_url_small,
          review_count,
          url,
          category,
          snippet_text,
          image_url,
          snippet_image_url,
          is_closed,
          location,
          display_phone,
          attendees {
            id,
            fullname,
          }
        }
        ${AddLocationMutation.getFragment('user')},
      }
    `,
  },
});
