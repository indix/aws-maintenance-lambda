var http = require('https');
var querystring = require('querystring');
var Promise = require('bluebird');

var utils = require('../utils');

var getRequestData = function(notificationData, config) {
  var data = JSON.stringify({
    'color': notificationData.color,
    'message': notificationData.message,
    'notify': true,
    'message_format': 'text',
    'card': {
      'style': 'application',
      'url': 'https://console.aws.amazon.com/ec2/v2/home?region=' + utils.getRegion()  + '#Events:',
      'format': 'medium',
      'id': notificationData.instanceId + notificationData.date,
      'title': 'AWS Maintenance Event',
      'description': notificationData.message,
      'icon': {
        'url': config.icon_url
      },
      'attributes': [
        {
          'label': 'Instance ID',
          'value': {
            'label': notificationData.instanceId
          }
        },
        {
          'label': 'Name',
          'value': {
            'label': notificationData.name
          }
        },
        {
          'label': 'Owner',
          'value': {
            'label': notificationData.owner
          }
        },
        {
          'label': 'Date',
          'value': {
            'label': notificationData.date
          }
        },
      ]
    }
  });

  var options = {
    hostname: 'api.hipchat.com',
    port: 443,
    path: '/v2/room/' + config.room + '/notification?auth_token=' + config.auth_token,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return { options, data };
};

module.exports = { getRequestData };
