import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import masonry from 'react-masonry-component';
let Masonry = masonry(React);

import ModalDisplay from './ModalDisplay';
import ImageListDisplay from './ImageListDisplay';

class Profile extends React.Component {
  componentWillMount() {
    this.props.relay.setVariables({
      username: this.props.params.username || '',
    });
  };
  masonryOptions = {
    transitionDuration: 0
  };
  render() {
    return (
      <div className='container text-center'>
        <div className="h3">{this.props.viewer.publicProfile.fullname}</div>
        <div className="line-break"></div>
        <Masonry
          className="masonry-root row"
          elementType={"div"}
          options={this.masonryOptions}
          disableImagesLoaded={false}>
          {
            this.props.viewer.publicProfile ? this.props.viewer.publicProfile.images.map(img => {
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

export default Relay.createContainer(Profile, {
  initialVariables: {
    username: ''
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id,
        publicProfile (username: $username) {
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
        }
      }
    `,
  },
});
