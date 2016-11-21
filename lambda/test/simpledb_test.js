var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var AWS = require('aws-sdk-mock');
describe("simpledb#createDomain", function() {
  var simpledb = require("../simpledb.js");

  afterEach(function() {
    AWS.restore('SimpleDB');
  });

  it("should create new domain if it doesn't exist", function() {
    AWS.mock('SimpleDB', 'createDomain', function (params, callback){
      callback(null, 'created');
    });
    
    return simpledb.createDomain().should.be.fulfilled;
  });
  
});

describe("simpledb#isInstanceToBeProcessed", function() {
  var simpledb = require("../simpledb.js");

  afterEach(function() {
    AWS.restore('SimpleDB');
  });
  
  it("should return true if event for instance has not been processed", function() {
    AWS.mock('SimpleDB', 'getAttributes', function (params, callback){
      if(params.DomainName === 'aws-maintenance-notifications' && params.ItemName === "instance-1event-1") {
       return callback(null, {});
      }
     
      return callback('error');
    });
    
    return simpledb.isInstanceToBeProcessed("instance-1", "event-1").should.eventually.equal(true);
  });
  
  it("should return false if event for instance has been processed", function() {
    AWS.mock('SimpleDB', 'getAttributes', function (params, callback){
      if(params.DomainName === 'aws-maintenance-notifications' && params.ItemName === "instance-1event-1") {
       return callback(null, { Attributes: 'done'});
      }
     
      return callback('error');
    });
    
    return simpledb.isInstanceToBeProcessed("instance-1", "event-1").should.eventually.equal(false);
  });
  
});


describe("simpledb#markInstanceAsProcessed", function() {
  var simpledb = require("../simpledb.js");

  afterEach(function() {
    AWS.restore('SimpleDB');
  });
  
  it("should set event of instance as processed", function() {
    AWS.mock('SimpleDB', 'putAttributes', function (params, callback){
      params.should.eql({
        DomainName: 'aws-maintenance-notifications',
        ItemName: "instance-1event-1",
        Attributes: [
          {
            Name: 'processed',
            Value: 'true'
          }
        ]
      });
      
      callback(null, 'done')
    });
    
    return simpledb.markInstanceAsProcessed("instance-1", "event-1").should.be.fulfilled
  });
  
});

