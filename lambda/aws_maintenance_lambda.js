var Promise = require('bluebird');

var slack = require('./slack');
var simpledb = require('./simpledb');
var ec2 = require('./ec2');

var handler = function* (event, context) {
  try {
    yield simpledb.createDomain();

    var instances = yield ec2.getInstancesUnderMaintenance();

    var newInstances = yield Promise.filter(Object.keys(instances), function(e) {
      var eventTimestamp = instances[e].Events[0].NotBefore;
      return simpledb.isInstanceToBeProcessed(e, eventTimestamp);
    });

    var slackPromises = newInstances.map(function(e) {
      return slack.sendMessage(instances[e])
        .then(function() {
          var eventTimestamp = instances[e].Events[0].NotBefore;
          return simpledb.markInstanceAsProcessed(e, eventTimestamp);
        });
    });

    yield Promise.all(slackPromises);

    context.done(null, 'Finished');
  } catch(e) {
    context.error('Error',  e);
  }
};

exports.handler = Promise.coroutine(handler);

//Uncomment below to test locally
// exports.handler(null, {
//   done: function(e, s) { console.log(s); },
//   error: function(e, ex) { console.log(ex);}
// });
