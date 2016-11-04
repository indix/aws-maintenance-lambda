var http = require('https');
var querystring = require('querystring');

var Promise = require('bluebird');

var config = require('./config.json').notifications.slack;

var getMessageColor = function(instanceDetails) {
  var color = 'danger';

  if(instanceDetails.Events[0].Description.indexOf('[Completed] ') === 0) {
    color = 'warning';
  }

  return color;
};

var sendMessage = function(instanceDetails) {
  var color = getMessageColor(instanceDetails);
  var message = instanceDetails.Events[0].Description;

  var tags = instanceDetails.details.Tags.reduce(function(final, current) {
    final[current.Key] = current.Value;
    return final;
  }, {});

  var name = tags["Name"];
  var owner = tags["Owner"];

  var payloadStr = JSON.stringify({
    "username": config.username,
    "channel": config.channel,
    "link_names": 1,
    "attachments": [
      {
        "title": "AWS Maintenance Event",
        "fallback": message,
        "text": message,
        "mrkdwn_in": ["fields"],
        "fields": [
          {
            "title": "Instance ID",
            "value": instanceDetails.InstanceId,
            "short": true
          },
          {
            "title": "Name",
            "value": name,
            "short": true
          },
          {
            "title": "Owner",
            "value": (config.owners[owner] ||  config.owners.all).owner,
            "short": true
          },
          {
            "title": "Date",
            "value": instanceDetails.Events[0].NotBefore.toLocaleString(),
            "short": true
          }
        ],
        "color": color
      }
    ],
    "icon_emoji": config.icon
  });

  var postData = querystring.stringify({
    "payload": payloadStr
  });

  var slackOptions = {
    hostname: 'hooks.slack.com',
    port: 443,
    path: config.hook.split('hooks.slack.com')[1],
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var promise = new Promise(function(resolve, reject) {
    var req = http.request(slackOptions, function(res) {
      res.on('data', function(chunk) {
        resolve(chunk);
      });
    }).on('error', function(e) {
      reject(e);
    });
    req.write(postData);
    req.end();
  })

  return promise;
};

exports.sendMessage = sendMessage;
