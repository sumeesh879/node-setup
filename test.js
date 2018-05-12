import glob   from 'glob';
import Mocha  from 'mocha';

// Load Environment
require('./env.loader.js');

// Create New Mocha Instance
const mocha = new Mocha({ reporter: 'spec' });

// Run Suite
glob('tests/**/*.js', (err, files) => {
  files.forEach(f => mocha.addFile(f));
  mocha.run(failures => process.exit(failures));
});
