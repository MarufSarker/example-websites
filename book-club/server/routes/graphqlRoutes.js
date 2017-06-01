import {Router} from 'express';
import graphQLHTTP from 'express-graphql';
import {Schema} from '../../graphql/schema';

let app = Router();

// Expose a GraphQL endpoint
app.use('/graphql', graphQLHTTP((req) => {
  return({
    graphiql: false,
    pretty: false,
    schema: Schema,
  })
}));

export default app;
