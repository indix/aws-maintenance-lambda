var Promise = require('bluebird');

var notification = require('./notifications/notification');
var simpledb = require('./simpledb');
var ec2 = require('./ec2');

var handler = function* (event, context, callback) {
  try {
    yield simpledb.createDomain();

    var instances = yield ec2.getInstancesUnderMaintenance();

    yield Promise.filter(Object.keys(instances), function(instance) {
      var eventTimestamp = instances[instance].Events[0].NotBefore;
      return simpledb.isInstanceToBeProcessed(instance, eventTimestamp);
    }).map(function(instance) {
      return notification.sendMessage(instances[instance])
        .then(function() {
          var eventTimestamp = instances[instance].Events[0].NotBefore;
          return simpledb.markInstanceAsProcessed(instance, eventTimestamp);
        });
    })
    
    callback(null, "Finished");
  } catch(ex) {
    callback(ex);
  }
};

exports.handler = Promise.coroutine(handler);

//Uncomment below to test locally
// exports.handler(null, null, function(e, s) {
//   if(e) {
//     console.log("[ERROR] " + e);
//     return;
//   }
//
//   console.log(s);
// });
