var utils = require('./utils');

var Promise = require('bluebird');
var AWS = require('aws-sdk');

var getInstancesUnderMaintenance = function() {
  var ec2 = new AWS.EC2(utils.getRegionObject());
  var instances = {};

  var instanceStatusParams = {
    DryRun: false,
    Filters: [
      {
        Name: 'event.code',
        Values: [
          'instance-reboot', 'system-reboot', 'system-maintenance', 'instance-retirement', 'instance-stop'
        ]
      },
    ],
    IncludeAllInstances: true,
    MaxResults: 10,
  };

  return ec2.describeInstanceStatus(instanceStatusParams)
    .promise()
    .then(function(data) {
      if(data.InstanceStatuses.length > 0) {
        data.InstanceStatuses.forEach(function(e) { instances[e.InstanceId] = e; });
        return ec2.describeInstances({ InstanceIds: Object.keys(instances) }).promise();
      }
    }).then(function(data) {
      if(data) {
        [].concat.apply([], data.Reservations.map(function(e) { return e.Instances; }))
          .forEach(function(e) { instances[e.InstanceId]['details'] = e; });
      }
      return instances;
    });
};

exports.getInstancesUnderMaintenance = getInstancesUnderMaintenance;
