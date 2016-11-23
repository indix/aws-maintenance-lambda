chai = require('chai');
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
var nock = require('nock');

before(function() {
  nock.disableNetConnect();
});

after(function() {
  nock.enableNetConnect();
});