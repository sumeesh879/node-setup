// Loads Environment
require('./env.loader');

// Start Server
require(`./${process.env.SRC_DIR_NAME}`); // eslint-disable-line
