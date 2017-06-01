import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import masonry from 'react-masonry-component';
let Masonry = masonry(React);

import ModalDisplay from './ModalDisplay';
import AddImageMutation from '../mutations/AddImageMutation';
import RemoveImageMutation from '../mutations/RemoveImageMutation';
import ImageListDisplay from './ImageListDisplay';

class UserGallery extends React.Component {
  addImage = (data) => {
    // console.log(data)
    Relay.Store.update(
      new AddImageMutation({
        user: this.props.user,
        title: data.imageTitle,
        imageLink: data.imageLink,
      })
    );
  };
  removeImage = (data) => {
    // console.log(data);
    Relay.Store.update(
      new RemoveImageMutation({
        user: this.props.user,
        id: data.img.id,
      })
    );
  };
  masonryOptions = {
    transitionDuration: 0
  };
  render() {
    // console.log(this)
    return (
      <div className='container text-center'>
        <ModalDisplay addImage={this.addImage}/>
        <div className="line-break"></div>
        <Masonry 
          className="masonry-root row"
          elementType={"div"}
          options={this.masonryOptions}
          disableImagesLoaded={false}>
          {
            this.props.user.images ? this.props.user.images.map(img => {
              return (
                <div key={img.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                  <ImageListDisplay img={img} user={true} onRemove={this.removeImage}/>
                </div>
              )
            }) : null
          }
        </Masonry>
      </div>
    );
  }
}

export default Relay.createContainer(UserGallery, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
        fullname,
        images {
          id,
          title,
          imageLink,
          dateAdded,
          addedBy,
        },
        ${AddImageMutation.getFragment('user')},
        ${RemoveImageMutation.getFragment('user')},
      }
    `,
  },
});
