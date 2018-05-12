require('babel-polyfill');

const NODE_ENV = process.env.nodeenv || process.env.NODE_ENV;

// Ensure Explicit NODE_ENV
if (!NODE_ENV) {
  throw new Error('NODE_ENV not set.');
}

require('dotenv').config({
  path: `config/.env.${NODE_ENV}`,
});
