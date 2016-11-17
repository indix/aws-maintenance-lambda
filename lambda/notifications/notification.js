var http = require('https');
var querystring = require('querystring');

var Promise = require('bluebird');

var config = require('../config.json').notifications;

var notificationChannels = {
  slack: require('./slack'),
  hipchat: require('./hipchat')
};

var getMessageColor = function(instanceDetails) {
  return instanceDetails.Events[0].Description.indexOf('[Completed] ') === 0 
    ? 'yellow' : 'red';
};

var postRequest = function(options, data) {
  return new Promise(function(resolve, reject) {
    var req = http.request(options, function(res) {
      if(res.statusCode < 200 || res.statusCode > 299) {
        return reject('Failed to send notification to ' + options.hostname + ' Status code: ' + res.statusCode );
      }
      
      var buffer = '';
      res.on('data', function(chunk) {
        if(chunk) {
          buffer += chunk;
        }
      }).on('end', function() {
        resolve(buffer);
      });
    }).on('error', function(e) {
      reject(e);
    });

    req.write(data);
    req.end();
  });
};

var getNotificationData = function(instanceDetails, config) {
  var tags = instanceDetails.details.Tags.reduce(function(final, current) {
    final[current.Key] = current.Value;
    return final;
  }, {});
  var owner = tags["Owner"];
  
  return {
    color: getMessageColor(instanceDetails),
    message: instanceDetails.Events[0].Description,
    name: tags["Name"],
    owner: (config.owners[owner] ||  config.owners.all).owner,
    date: instanceDetails.Events[0].NotBefore.toLocaleString(),
    instanceId: instanceDetails.InstanceId
  };
}

var sendMessage = function(instanceDetails) {
  var notificationPromises = Object.keys(config).map(function(channel) {
    var notificationData = getNotificationData(instanceDetails, config[channel]);
    var requestData = notificationChannels[channel].getRequestData(notificationData, config[channel]);
    
    return postRequest(requestData.options, requestData.data);
  });
  
  return Promise.all(notificationPromises);
};

exports.sendMessage = sendMessage;