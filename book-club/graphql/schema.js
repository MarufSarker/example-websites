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
  getViewer,
  getUser,
  getBook,
  getBooks,
  addBook,
  removeBook,
  addRequest,
  removeRequest,
  responseRequest,
  returnBook,
  getSearchResults,
} from '../data/database';

import {
  USERObj,
  BOOKObj,
} from '../data/dataObjects';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Book') {
      return getBook(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof USERObj) {
      return userType;
    } else if (obj instanceof BOOKObj)  {
      return bookType;
    } else {
      return null;
    }
  }
);

var addedByType = new GraphQLObjectType({
  name: 'AddedByType',
  fields: () => ({
    username: {
      type: GraphQLString,
    },
    available: {
      type: GraphQLString,
    },
  }),
})

var bookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Properties of a Book',
  fields: () => ({
    id: globalIdField('Book'),
    title: {
      type: GraphQLString,
    },
    authors: {
      type: GraphQLString,
    },
    categories: {
      type: GraphQLString,
    },
    publisher: {
      type: GraphQLString,
    },
    publishedDate: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    pageCount: {
      type: GraphQLInt,
    },
    averageRating: {
      type: GraphQLFloat,
    },
    smallThumbnail: {
      type: GraphQLString,
    },
    thumbnail: {
      type: GraphQLString,
    },
    language: {
      type: GraphQLString,
    },
    canonicalVolumeLink: {
      type: GraphQLString,
    },
    addedBy: {
      type: new GraphQLList(addedByType)
    }
  }),
  interfaces: [nodeInterface],
});

let statusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    book: {
      type: bookType,
      resolve: (obj) => {
        return getBook(obj.id)
      }
    },
    username: {
      type: GraphQLString,
      resolve: (obj) => obj.username
    },
  })
});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'Logged in User',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: GraphQLString,
      description: 'Username of the user',
    },
    fullname: {
      type: GraphQLString,
      description: 'Username of the user',
    },
    books: {
      type: new GraphQLList(bookType),
      resolve: (obj) => {
        let booksArray = obj.books ? obj.books.map(book => {
          return getBook(book.id);
        }) : null;
        return booksArray;
      },
    },
    requests: {
      type: new GraphQLList(statusType),
    },
    pendings: {
      type: new GraphQLList(statusType),
    },
    borrows: {
      type: new GraphQLList(statusType),
    },
    acceptedrequests: {
      type: new GraphQLList(statusType),
    },
  }),
  interfaces: [nodeInterface],
});

let searchResultType = new GraphQLObjectType({
  name: 'SearchResult',
  fields: () => ({
    book: {
      type: bookType,
      resolve: (obj) => {
        return getBook(obj)
      }
    },
  })
});

let viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type: userType,
      args: {
        username: {
          type: GraphQLString,
        }
      },
      resolve: (root, {username}) => getUser(username),
    },
    books: {
      type: new GraphQLList(bookType),
      resolve: () => getBooks(),
    },
    book: {
      type: bookType,
      args: {
        id: {
          type: GraphQLString,
        }
      },
      resolve: (root, {id}) => {
        id = fromGlobalId(id).id;
        if (id.length < 4) {
          return null;
        }
        return getBook(id);
      },
    },
    search: {
      type: new GraphQLList(searchResultType),
      args: {
        searchTerm: {
          type: GraphQLString,
        }
      },
      resolve: (root, {searchTerm}) => {
        if (searchTerm.length > 0) {
          return getSearchResults(searchTerm);
        }
        return null;
      },
    },
  }),
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: viewerType,
      resolve: () => getViewer(),
    },
  }),
});

var addBookMutation = mutationWithClientMutationId({
  name: 'AddBook',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    title: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    authors: {
      type: new GraphQLNonNull(GraphQLString),
    },
    categories: {
      type: new GraphQLNonNull(GraphQLString),
    },
    publisher: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    publishedDate: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    pageCount: {
      type: new GraphQLNonNull(GraphQLInt),
    }, 
    averageRating: {
      type: new GraphQLNonNull(GraphQLFloat),
    }, 
    smallThumbnail: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    thumbnail: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    language: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
    canonicalVolumeLink: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    }
  },
  mutateAndGetPayload: ({username, id, title, authors, categories, publisher, publishedDate, description, pageCount, averageRating, smallThumbnail, thumbnail, language, canonicalVolumeLink}) => {
    return new Promise((resolve, reject) => {
      addBook({username, id, title, authors, categories, publisher, publishedDate, description, pageCount, averageRating, smallThumbnail, thumbnail, language, canonicalVolumeLink}).then(data => resolve(data));
    });
  },
});

var removeBookMutation = mutationWithClientMutationId({
  name: 'RemoveBook',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    }
  },
  mutateAndGetPayload: ({username, id}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      removeBook({username, id}).then(data => resolve(data));
    });
  },
});

var addRequestMutation = mutationWithClientMutationId({
  name: 'AddRequest',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bookOwner: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    }
  },
  mutateAndGetPayload: ({username, id, bookOwner}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      addRequest({username, id, bookOwner}).then(data => resolve(data));
    });
  },
});

var removeRequestMutation = mutationWithClientMutationId({
  name: 'RemoveRequest',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bookOwner: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    }
  },
  mutateAndGetPayload: ({username, id, bookOwner}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      removeRequest({username, id, bookOwner}).then(data => resolve(data));
    });
  },
});

var responseRequestMutation = mutationWithClientMutationId({
  name: 'ResponseRequest',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    requestedBy: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    response: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    }
  },
  mutateAndGetPayload: ({username, requestedBy, id, response}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      responseRequest({username, requestedBy, id, response}).then(data => resolve(data));
    });
  },
});

var returnBookMutation = mutationWithClientMutationId({
  name: 'ReturnBook',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bookOwner: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (data) => getUser(data.username)
    }
  },
  mutateAndGetPayload: ({username, bookOwner, id}) => {
    id = fromGlobalId(id).id;
    return new Promise((resolve, reject) => {
      returnBook({username, bookOwner, id}).then(data => resolve(data));
    });
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addBook: addBookMutation,
    removeBook: removeBookMutation,
    addRequest: addRequestMutation,
    removeRequest: removeRequestMutation,
    responseRequest: responseRequestMutation,
    returnBook: returnBookMutation,
  }),
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
