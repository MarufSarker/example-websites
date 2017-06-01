import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Modal} from 'react-bootstrap';

class ModalDisplay extends React.Component {
  state = {
    show: false,
    imageSrc: "",
    validImage: false,
    errorMessage: '',
  };
  handleLink = (evt) => {
    // console.log(evt)
    let lnk = ReactDOM.findDOMNode(this.refs.imageLink).value;
    let defaultNoImage = "no-image.png"
    if (lnk.length > 0) {
      let ax = loadImg(lnk).then(d => {
        if (d) {
          this.setState({imageSrc: lnk, validImage: true});
        } else {
          this.setState({imageSrc: defaultNoImage, validImage: false});
        }
      });
    } else {
      this.setState({imageSrc: defaultNoImage, validImage: false});
    }
    function loadImg(url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = function(){resolve(true)}
        img.onerror = function(){resolve(false)}
        img.src = url;
      });
    }
  };
  handleButtonClick = (evt) => {
    evt.preventDefault();
    let imgLnk = ReactDOM.findDOMNode(this.refs.imageLink).value || null;
    let imgTtl = ReactDOM.findDOMNode(this.refs.imageTitle).value || null;
    if (imgLnk && imgTtl) {
      if (this.state.validImage) {
        this.props.addImage({imageLink: imgLnk, imageTitle: imgTtl});
        this.setState({errorMessage: 'Image Added!', imageSrc: ''});
        setTimeout(() => {
          this.setState({errorMessage: ''});
          ReactDOM.findDOMNode(this.refs.imageLink).value = '';
          ReactDOM.findDOMNode(this.refs.imageTitle).value = '';
        }, 1500);
      } else {
        this.setState({errorMessage: 'Invalid Image Link!'});
        setTimeout(() => {
          this.setState({errorMessage: ''});
        }, 2000);
      }
    } else if (!imgLnk) {
      this.setState({errorMessage: 'Add Valid Image Link!'});
      setTimeout(() => {
          this.setState({errorMessage: ''});
        }, 2000);
    } else if (!imgTtl) {
      this.setState({errorMessage: 'Add Image Title!'});
      setTimeout(() => {
          this.setState({errorMessage: ''});
        }, 2000);
    } else {
      this.setState({errorMessage: 'Something Went Wrong!'});
    }
  };
  render() {
    let close = () => this.setState({ show: false});
    return (
      <div className="modal-container">
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.setState({ show: true})}>
          Add Image
        </Button>
        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
          backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Add Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row text-center container-fluid">
              <img src={this.state.imageSrc} alt="" style={{height: 300, width: "80%"}} className="center-block"/>
              <form className="imageLinkForm">
                <div className="form-group">
                  <label htmlFor="image-url" style={{float: "left"}}>Link</label>
                  <input type="text" ref="imageLink" id="image-url" onChange={this.handleLink} className="form-control imageLinkInput" placeholder="Valid Image Link"/>
                  <label htmlFor="image-title" style={{float: "left"}}>Image Title</label>
                  <input type="text" ref="imageTitle" id="image-title" className="form-control" placeholder="Image Title"/>
                </div>
                <button type="submit" onClick={this.handleButtonClick} className="btn btn-primary btn-block">Add</button>
                {this.state.errorMessage}
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalDisplay;
