var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var AWS = require('aws-sdk-mock');

describe("ec2#getInstancesUnderMaintenance", function() {
  var ec2 = require("../ec2.js");
  
  afterEach(function() {
    AWS.restore('EC2');
  });

  it("should return empty if no instance under maintenance", function() {
    AWS.mock('EC2', 'describeInstanceStatus', function (params, callback){
      callback(null, {
        InstanceStatuses: []
      });
    });
    
    return ec2.getInstancesUnderMaintenance().should.eventually.eql({});
  });
  
  it("should return instances under maintenance", function() {
    AWS.mock('EC2', 'describeInstanceStatus', function (params, callback){
      callback(null, {
        InstanceStatuses: [
          {
            InstanceId: "id-1"
          }
        ]
      });
    });
    AWS.mock('EC2', 'describeInstances', function (params, callback){
      callback(null, {
        Reservations: [
          {
            Instances: [
              {
                InstanceId: "id-1",
                Tags: [
                  {
                    Key: "Name",
                    Value: "Instance 1"
                  }
                ]
              }
            ]
          }
        ]
      });
    });
    return ec2.getInstancesUnderMaintenance().should.eventually.eql({
      "id-1": {
        InstanceId: "id-1",
        details: {
          InstanceId: "id-1",
          Tags: [
            {
              Key: "Name",
              Value: "Instance 1"
            }
          ]
        }
      }
    });
  });
});

