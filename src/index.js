import express      from 'express';
import bodyParser   from 'body-parser';
import os           from 'os';
import compression  from 'compression';
import helmet       from 'helmet';
import morgan       from 'morgan';
import {
  graphiqlExpress,
  graphqlExpress,
}                   from 'apollo-server-express';

import router       from './router';
import logger       from '../logger';
import schema       from './graphql/schema';

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: logger.stream }));

app.use(bodyParser.json({ limit: '64mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

const PORT = JSON.parse(process.env.NODE_PORT || 8080);
app.listen(PORT);

logger.info({
  'Service is Running in container': {
    container: os.hostname(),
    port: PORT
  }
});

export default app;
