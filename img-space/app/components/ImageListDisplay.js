import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

class ImageListDisplay extends React.Component {
  handleClick = (evt) => {
    let floatingMenuClass = ReactDOM.findDOMNode(this.refs.floatingMenu).className;
    let titleClass = ReactDOM.findDOMNode(this.refs.imgTitle).className;
    if (floatingMenuClass === 'hidden') {
      ReactDOM.findDOMNode(this.refs.floatingMenu).className = 'show';
      ReactDOM.findDOMNode(this.refs.imgTitle).className = 'hidden';
    } else {
      ReactDOM.findDOMNode(this.refs.floatingMenu).className = 'hidden';
      ReactDOM.findDOMNode(this.refs.imgTitle).className = 'show h4';
    }
  };
  handleRemoveImage = (evt) => {
    let dataOBJ = {
      img: evt,
    };
    this.props.onRemove(dataOBJ);
  };
  render() {
    let {img} = this.props;
    return (
      <div
        className="thumbnail masonry-item">
        <img src={img.imageLink} alt={img.title} onClick={this.props.user ? this.handleClick.bind(this, img) : null}/>
        <div className="imgAddedBy">
          <Link to={`profile/${img.addedBy}`}>{img.addedBy}</Link>
        </div>
        <div className="caption">
          {
            this.props.user ?
            (
              <div>
                <div className="show h4" ref="imgTitle">{img.title}</div>
                <div className="hidden" ref="floatingMenu">
                  <div onClick={this.handleRemoveImage.bind(this, img)} className="btn btn-danger btn-lg btn-block">
                    Remove This Image
                  </div>
                </div>
              </div>
            ) :
            (
              <div className="show h4" ref="imgTitle">{img.title}</div>
            )
          }
        </div>
      </div>
    );
  }
}

export default ImageListDisplay;
