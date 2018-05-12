import express    from 'express';

import Redis      from './redis';
import logger     from '../logger';

const router = express.Router();

router.get('*', (request, response) => {
  logger.info('Logger works! 👍');
  response.json({ success: true });
});

router.post('/redis', async (request, response) => {
  const { method, args, payload } = request.body;
  const cache = new Redis();
  response.json(await cache.customQuery(method, args, payload));
});

export default router;
