import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  offsetToCursor,
} from 'graphql-relay';

import {
  UserObj,
  ImageObj,
} from '../data/dataObjects';

import {
  test,
  getUser,
  getImage,
  getImages,
  addImage,
  removeImage,
  getUserImages,
} from '../data/database';

function getViewer() {
  return {};
}

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Image') {
      return getImage(id);
    } else if (type === 'Viewer') {
      return getViewer(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof UserObj) {
      return userType;
    } else if (obj instanceof ImageObj)  {
      return imageType;
    } else {
      return null;
    }
  }
);

var imageType = new GraphQLObjectType({
  name: 'Image',
  description: 'An Image',
  fields: () => ({
    id: globalIdField('Image'),
    title: {
      type: GraphQLString,
      description: 'Title of the Image',
    },
    imageLink: {
      type: GraphQLString,
      description: 'Link of the Image',
    },
    dateAdded: {
      type: GraphQLString,
    },
    addedBy: {
      type: GraphQLString,
    }
  }),
  interfaces: [nodeInterface],
});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'An User',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: GraphQLString,
    },
    fullname: {
      type: GraphQLString,
    },
    images: {
      type: new GraphQLList(imageType),
      description: 'Collection of images',
      resolve: (obj) => {
        let usrImgs = obj.images ? obj.images.map(imgID => getImage(imgID)) : null;
        if (usrImgs) {
          return usrImgs;
        } else {
          return null;
        }
      }
    },
  }),
  interfaces: [nodeInterface],
});

var viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: globalIdField('Viewer'),
    publicImages: {
      type: new GraphQLList(imageType),
      resolve: () => getImages(),
    },
    publicProfile: {
      type: userType,
      args: {
        username: {
          type: GraphQLString,
        },
      },
      resolve: (root, {username}) => {
        return getUser(username)
      },
    }
  },
  interfaces: [nodeInterface]
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: userType,
      args: {
        username: {
          type: GraphQLString,
        },
      },
      resolve: (root, {username}) => {
        return getUser(username)
      },
    },
    viewer: {
      type: viewerType,
      resolve: () => getViewer()
    }
  }),
});

var addImageMutation = mutationWithClientMutationId({
  name: 'AddImage',
  inputFields: {
    username: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
      description: 'Title of the Image',
    },
    imageLink: {
      type: GraphQLString,
      description: 'Link of the Image',
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (payload) => getUser(payload.username)
    },
  },
  mutateAndGetPayload: ({username, title, imageLink}) => {
    return new Promise((resolve, reject) => {
      addImage({username, title, imageLink}).then(data => resolve(data));
    });
  },
});

var removeImageMutation = mutationWithClientMutationId({
  name: 'RemoveImage',
  inputFields: {
    username: {
      type: GraphQLString,
    },
    id: {
      type: GraphQLString,
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (payload) => getUser(payload.username)
    },
  },
  mutateAndGetPayload: ({username, id}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      removeImage({username, id}).then(data => resolve(data));
    });
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addImage: addImageMutation,
    removeImage: removeImageMutation,
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
