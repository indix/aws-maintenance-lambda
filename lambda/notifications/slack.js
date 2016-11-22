var http = require('https');
var querystring = require('querystring');
var Promise = require('bluebird');

var getRequestData = function(notificationData, config) {
  notificationData.color = notificationData.color === 'red' ? 'danger' : 'warning';
  
  var payloadStr = JSON.stringify({
    'username': config.username,
    'channel': config.channel,
    'link_names': 1,
    'attachments': [
      {
        'title': 'AWS Maintenance Event',
        'fallback': notificationData.message,
        'text': notificationData.message,
        'mrkdwn_in': ['fields'],
        'fields': [
          {
            'title': 'Instance ID',
            'value': notificationData.instanceId,
            'short': true
          },
          {
            'title': 'Name',
            'value': notificationData.name,
            'short': true
          },
          {
            'title': 'Owner',
            'value': notificationData.owner,
            'short': true
          },
          {
            'title': 'Date',
            'value': notificationData.date,
            'short': true
          }
        ],
        'color': notificationData.color
      }
    ],
    'icon_url': config.icon_url
  });

  var data = querystring.stringify({
    'payload': payloadStr
  });

  var options = {
    hostname: 'hooks.slack.com',
    port: 443,
    path: config.hook.split('hooks.slack.com')[1],
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  };

  return { options, data };
};

exports.getRequestData = getRequestData;
