var utils = require('./utils');

var Promise = require('bluebird');
var AWS = require('aws-sdk');


var config = require('./config.json').store.simpledb;

var createDomain = function() {
  var simpledb = new AWS.SimpleDB(utils.getRegionObject());
  return simpledb.createDomain({ DomainName: config.domain }).promise();
};

var deleteDomain = function() {
  var simpledb = new AWS.SimpleDB(utils.getRegionObject());
  return simpledb.deleteDomain({ DomainName: config.domain }).promise();
};

var isInstanceToBeProcessed = function(instance, eventTimestamp) {
  var simpledb = new AWS.SimpleDB(utils.getRegionObject());
  var key = instance + eventTimestamp;
  return simpledb.getAttributes({
    DomainName: config.domain,
    ItemName: key,
    AttributeNames: [ 'processed' ],
    ConsistentRead: true
  })
  .promise()
  .then(function(data) {
    return data.Attributes === undefined;
  });
};

var markInstanceAsProcessed = function(instance, eventTimestamp) {
  var simpledb = new AWS.SimpleDB(utils.getRegionObject());
  var key = instance + eventTimestamp;
  return simpledb.putAttributes({
    DomainName: config.domain,
    ItemName: key,
    Attributes: [
      {
        Name: 'processed',
        Value: 'true'
      }
    ]
  }).promise();
};

module.exports = { createDomain, deleteDomain, isInstanceToBeProcessed, markInstanceAsProcessed};