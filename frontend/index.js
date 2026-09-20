const minimatch = require('minimatch');
const { v4: uuidv4 } = require('uuid');

console.log('frontend-service', uuidv4(), minimatch('foo', 'f*'));
