import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
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
  USERObj,
  SURVEYObj,
} from '../data/dataObjects';

import {
  getUser,
  getSurvey,
  getSurveys,
  addSurvey,
  removeSurvey, 
  voteSurvey,
  shareSurvey,
} from '../data/database';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Survey') {
      return getSurvey(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof USERObj) {
      return userType;
    } else if (obj instanceof SURVEYObj)  {
      return surveyType;
    } else {
      return null;
    }
  }
);

var optionType = new GraphQLObjectType({
  name: 'Option',
  fields: () => ({
    optionTitle: {
      type: GraphQLString,
    },
    optionVotes: {
      type: GraphQLInt,
    },
  }),
});

var votersType = new GraphQLObjectType({
  name: 'Voter',
  fields: () => ({
    username: {
      type: GraphQLString,
      resolve: (obj) => obj
    }
  }),
});

var surveyType = new GraphQLObjectType({
  name: 'Survey',
  description: 'Survey description',
  fields: () => ({
    id: globalIdField('Survey'),
    title: {
      type: GraphQLString,
    },
    addedBy: {
      type: GraphQLString,
    },
    shares: {
      type: GraphQLInt,
    },
    options: {
      type: new GraphQLList(optionType),
    },
    allVoters: {
      type: new GraphQLList(votersType),
    },
  }),
  interfaces: [nodeInterface],
});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'An user',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fullname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    surveys: {
      type: new GraphQLList(surveyType),
      resolve: (obj) => {
        let surveys = obj.surveys ? obj.surveys.map(survey => getSurvey(survey.id)) : null;
        return surveys;
      }
    },
  }),
  interfaces: [nodeInterface],
});

var viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    user: {
      type: userType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (root, {username}) => getUser(username)
    },
    surveys: {
      type: new GraphQLList(surveyType),
      resolve: () => getSurveys(),
    },
    survey: {
      type: surveyType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (root, {id}) => {
        if (id.length < 9) {
          return null
        } else {
          id = fromGlobalId(id).id;
          return getSurvey(id);
        }
      }
    },
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: viewerType,
      resolve: () => {
        return {};
      }
    },
  }),
});

var inputOptionType = new GraphQLInputObjectType({
  name: 'InputOption',
  fields: () => ({
    optionTitle: {
      type: GraphQLString,
    },
  }),
});

var addSurveyMutation = mutationWithClientMutationId({
  name: 'AddSurvey',
  inputFields: {
    username: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    options: {
      type: new GraphQLList(inputOptionType),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    },
  },
  mutateAndGetPayload: ({username, title, options}) => {
    return new Promise((resolve, reject) => {
      addSurvey({username, title, options}).then(data => resolve(data))
    });
  },
});

var removeSurveyMutation = mutationWithClientMutationId({
  name: 'RemoveSurvey',
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
      removeSurvey({username, id}).then(data => resolve(data))
    });
  },
});

var voteSurveyMutation = mutationWithClientMutationId({
  name: 'VoteSurvey',
  inputFields: {
    username: {
      type: GraphQLString,
    },
    id: {
      type: GraphQLString,
    },
    optionTitle: {
      type: GraphQLString,
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    },
    survey: {
      type: surveyType,
      resolve: (data) => getSurvey(data.id),
    }
  },
  mutateAndGetPayload: ({username, id, optionTitle}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      voteSurvey({username, id, optionTitle}).then(data => resolve(data))
    });
  },
});

var shareSurveyMutation = mutationWithClientMutationId({
  name: 'ShareSurvey',
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
    survey: {
      type: surveyType,
      resolve: (data) => getSurvey(data.id),
    }
  },
  mutateAndGetPayload: ({username, id}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      shareSurvey({username, id}).then(data => resolve(data))
    });
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addSurvey: addSurveyMutation,
    removeSurvey: removeSurveyMutation,
    voteSurvey: voteSurveyMutation,
    shareSurvey: shareSurveyMutation,
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
