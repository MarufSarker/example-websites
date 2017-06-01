import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import masonry from 'react-masonry-component';
let Masonry = masonry(React);

import ImageListDisplay from './ImageListDisplay';

class PublicGallery extends React.Component {
  masonryOptions = {
    transitionDuration: 0
  };
  render() {
    return (
      <div className='container text-center'>
        <div className="line-break"></div>
        <Masonry
          className="masonry-root row"
          elementType={"div"}
          options={this.masonryOptions}
          disableImagesLoaded={false}>
          {
            this.props.viewer.publicImages ? this.props.viewer.publicImages.map(img => {
              return (
                <div key={img.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                  <ImageListDisplay img={img}/>
                </div>
              )
            }) : null
          }
        </Masonry>
      </div>
    );
  }
}

export default Relay.createContainer(PublicGallery, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id,
        publicImages {
          id,
          title,
          imageLink,
          dateAdded,
          addedBy,
        }
      }
    `,
  },
});
