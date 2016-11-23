var region = process.env.AWS_DEFAULT_REGION || 'us-east-1';

var getRegion = function () {
  return region;
}

var getRegionObject = function() {
  return { region: region };
}

module.exports = { getRegion, getRegionObject };