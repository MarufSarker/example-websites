import React from 'react';
import ReactDOM from 'react-dom';

class UserLocationsDisplay extends React.Component {
  handleClick = (evt) => {
    let floatingMenuClass = ReactDOM.findDOMNode(this.refs.floatingMenu).className;
    if (floatingMenuClass === 'hidden') {
      ReactDOM.findDOMNode(this.refs.floatingMenu).className = 'show';
    } else {
      ReactDOM.findDOMNode(this.refs.floatingMenu).className = 'hidden';
    }
  };
  handleRemoveThisPlace = (evt) => {
    let dataOBJ = {
      id: evt.id,
    };
    this.props.handleRemovePlace(dataOBJ);
  };
  render() {
    let {loc} = this.props;
    let backupImage = "no-image.png";
    return (
      <div>
        <div className="pull-left">
          <a href={loc.url} target="_blank">
            <img
              src={loc.image_url ? loc.image_url : backupImage}
              alt={loc.name}
              className="img-thumbnail"/>
          </a>
        </div>
        <div
          className="clearfix"
          style={{cursor:"pointer"}}
          onClick={this.handleClick.bind(this, loc)}>
          <div className="h4">
            {loc.name}
          </div>
          <div className="ratingsCount">
            <img src={loc.rating_img_url_small}/>
            <span>
              {" (" + loc.review_count + ")"}
            </span>
            <div>
              <a className="resultPhone" href={`tel:${loc.display_phone}`}>{loc.display_phone}</a>
              <p className="resultLocation">{loc.location}</p>
            </div>
          </div>
          <div>{loc.snippet_text}</div>
        </div>
        <div className="hidden" ref="floatingMenu">
          <div onClick={this.handleRemoveThisPlace.bind(this, loc)} className="btn btn-danger btn-lg btn-block">
            Remove This Place
          </div>
        </div>
      </div>
    );
  }
}

export default UserLocationsDisplay;
