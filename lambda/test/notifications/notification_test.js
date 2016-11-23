var rewire = require('rewire');
var nock = require('nock');
var testInstanceDetails = require('../data/instance_details.json');

describe('notification#sendMessage', function() {
  it('should not send message if no notification handler is configured', function() {
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/default.json').notifications);
    
    notification.sendMessage({}).should.be.fulfilled;
  });
  
  it('should fail when unable to send notification to slack ', function() {
    nock('https://hooks.slack.com')
      .intercept('/123456', 'POST')
      .reply(500);
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/with_slack_notification.json').notifications);
    notification.sendMessage(testInstanceDetails).should.be.rejected;
  });
  
  it('should send notification to slack ', function() {
    nock('https://hooks.slack.com')
      .intercept('/123456', 'POST')
      .reply(200);
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/with_slack_notification.json').notifications);
    notification.sendMessage(testInstanceDetails).should.be.fulfilled;
  });
  
  it('should fail when unable to send notification to hipchat', function() {
    nock('https://api.hipchat.com')
      .intercept('/v2/room/alerts/notification', 'POST')
      .query({ auth_token: '123456' })
      .reply(500);
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/with_hipchat_notification.json').notifications);
    notification.sendMessage(testInstanceDetails).should.be.rejected;
  });
  
  it('should send notification to hipchat', function() {
    nock('https://api.hipchat.com')
      .intercept('/v2/room/alerts/notification', 'POST')
      .query({ auth_token: '123456' })
      .reply(200);
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/with_hipchat_notification.json').notifications);
    notification.sendMessage(testInstanceDetails).should.be.fulfilled;
  });
  
  it('should fail if failure to send notification to slack or hipchat', function() {
    nock('https://hooks.slack.com')
      .intercept('/123456', 'POST')
      .reply(200);
    nock('https://api.hipchat.com')
      .intercept('/v2/room/alerts/notification', 'POST')
      .query({ auth_token: '123456' })
      .reply(500);
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/with_slack_and_hipchat_notification.json').notifications);
    notification.sendMessage(testInstanceDetails).should.be.rejected;
  });
  
  it('should send notification to slack and hipchat', function() {
    var slackNock = nock('https://hooks.slack.com')
      .intercept('/123456', 'POST')
      .reply(200);
    var hipchatNock = nock('https://api.hipchat.com')
      .intercept('/v2/room/alerts/notification', 'POST')
      .query({ auth_token: '123456' })
      .reply(200);
    var notification = rewire('../../notifications/notification');
    notification.__set__('config', require('../config/with_slack_and_hipchat_notification.json').notifications);
    notification.sendMessage(testInstanceDetails).should.be.fulfilled
      .then(function() {
        slackNock.done();
        hipchatNock.done();
      });
  });
});