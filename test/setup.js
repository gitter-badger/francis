global._ = require('underscore');
global.Francis = require('../francis');

global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
chai.use(sinonChai);
