import React from 'react';
import ReactDOM from 'react-dom';

class ResultsDisplay extends React.Component {
  handleClick = (evt) => {
    let floatingMenuClass = ReactDOM.findDOMNode(this.refs.floatingMenu).className;
    if (floatingMenuClass === 'hidden') {
      ReactDOM.findDOMNode(this.refs.floatingMenu).className = 'show';
    } else {
      ReactDOM.findDOMNode(this.refs.floatingMenu).className = 'hidden';
    }
  };
  handleAddThisPlace = (evt) => {
    ReactDOM.findDOMNode(this.refs[evt.id]).innerHTML = "Added This Place";
    ReactDOM.findDOMNode(this.refs[evt.id]).setAttribute('disabled', 'disabled');
    let dataOBJ = {
      id: evt.id,
      name: evt.name,
      rating: evt.rating.toString(),
      rating_img_url_small: evt.rating_img_url_small,
      review_count: evt.review_count.toString(),
      url: evt.url,
      category: evt.category,
      snippet_text: evt.snippet_text,
      image_url: evt.image_url,
      snippet_image_url: evt.snippet_image_url,
      is_closed: evt.closed.toString(),
      location: evt.location,
      display_phone: evt.phone,
    };
    this.props.handleAddPlace(dataOBJ);
  };
  handleIfAddedPlace = (currentItem) => {
    function isAdded (elem) {
      return elem === currentItem;
    }
    if (this.props.userPlaces) {
      return this.props.userPlaces.some(isAdded);
    } else {
      return false;
    }
  };
  render() {
    // console.log(this.props)
    let {data} = this.props;
    let backupImage = "no-image.png";
    // console.log(data)
    return (
      <div>
        <div className="pull-left">
          <a href={data.url} target="_blank">
            <img
              src={data.image_url ? data.image_url : backupImage}
              alt={data.name}
              className="img-thumbnail"/>
          </a>
        </div>
        <div
          className="clearfix"
          style={{cursor:"pointer"}}
          onClick={this.handleClick.bind(this, data)}>
          <div className="h4">
            {data.name}
          </div>
          <div className="ratingsCount">
            <img src={data.rating_img_url_small}/>
            <span>
              {" (" + data.review_count + ")"}
            </span>
            <div>
              <a className="resultPhone" href={`tel:${data.display_phone}`}>{data.display_phone}</a>
              <p className="resultLocation">{data.location}</p>
            </div>
          </div>
          <div>{data.snippet_text}</div>
        </div>
        <div className="hidden" ref="floatingMenu">
          {
            this.handleIfAddedPlace(data.url) ?
            <div className="btn btn-primary btn-lg btn-block" disabled="disabled">
              Already Added This Place
            </div>
            :
            <div onClick={this.handleAddThisPlace.bind(this, data)} ref={data.id} className="btn btn-primary btn-lg btn-block">
              Add This Place
            </div>
          }
        </div>
      </div>
    );
  }
}

export default ResultsDisplay;
