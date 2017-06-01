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
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  User,
  Business,
} from '../data/dataObjects';

import {
  getUser,
  getViewer,
  getBusiness,
  addLocation,
  removeLocation,
  getPseudoUser,
  getPseudoBusinesses,
} from '../data/database';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Business') {
      return getBusiness(id);
    } else if (type === 'PseudoUser') {
      return getPseudoUser(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Business)  {
      return businessType;
    } else {
      return null;
    }
  }
);

var pseudoUserType = new GraphQLObjectType({
  name: 'PseudoUser',
  description: 'Attending User',
  fields: () => ({
    id: globalIdField('PseudoUser'),
    fullname: {
      type: GraphQLString,
    },
  }),
});

var businessType = new GraphQLObjectType({
  name: 'Business',
  description: 'Business description',
  fields: () => ({
    id: globalIdField('Business'),
    name: {
      type: GraphQLString,
      description: 'Name of the business',
    },
    rating: {
      type: GraphQLString,
    },
    rating_img_url_small: {
      type: GraphQLString,
    },
    review_count: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    category: {
      type: GraphQLString,
    },
    snippet_text: {
      type: GraphQLString,
    },
    image_url: {
      type: GraphQLString,
    },
    snippet_image_url: {
      type: GraphQLString,
    },
    is_closed: {
      type: GraphQLString,
    },
    location: {
      type: GraphQLString,
    },
    display_phone: {
      type: GraphQLString,
    },
    attendees: {
      type: new GraphQLList(pseudoUserType),
      resolve: (obj) => {
        let attendees = Object.keys(obj.attendees);
        return getPseudoUser(attendees);
      }
    },
  }),
  interfaces: [nodeInterface],
});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'Logged-in user',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fullname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    attendingLocations: {
      type: new GraphQLList(businessType),
      resolve: (obj) => {
        if (obj.attendingLocations) {
          let businesses = Object.keys(obj.attendingLocations);
          return getPseudoBusinesses(businesses);
        } else {
          return null;
        }
      }
    },
  }),
  interfaces: [nodeInterface],
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: userType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (root, {username}) => getUser(username)
    },
  }),
});

var addLocationMutation = mutationWithClientMutationId({
  name: 'AddLocation',
  inputFields: {
    username: {
      type: GraphQLString,
    },
    id: {
      type: GraphQLString,
      description: "YELP ID of the business",
    },
    name: {
      type: GraphQLString,
      description: 'Name of the business',
    },
    rating: {
      type: GraphQLString,
    },
    rating_img_url_small: {
      type: GraphQLString,
    },
    review_count: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    category: {
      type: GraphQLString,
    },
    snippet_text: {
      type: GraphQLString,
    },
    image_url: {
      type: GraphQLString,
    },
    snippet_image_url: {
      type: GraphQLString,
    },
    is_closed: {
      type: GraphQLString,
    },
    location: {
      type: GraphQLString,
    },
    display_phone: {
      type: GraphQLString,
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    },
  },
  mutateAndGetPayload: ({username, id, name, rating, rating_img_url_small, review_count, url, category, snippet_text, image_url, snippet_image_url, is_closed, location, display_phone}) => {
    return new Promise((resolve, reject) => {
      addLocation({username, id, name, rating, rating_img_url_small, review_count, url, category, snippet_text, image_url, snippet_image_url, is_closed, location, display_phone}).then(data => resolve(data))
    });
  },
});

var removeLocationMutation = mutationWithClientMutationId({
  name: 'RemoveLocation',
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
      resolve: (data) => getUser(data.username)
    },
  },
  mutateAndGetPayload: ({username, id}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      removeLocation({username, id}).then(data => resolve(data))
    });
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addLocation: addLocationMutation,
    removeLocation: removeLocationMutation,
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
