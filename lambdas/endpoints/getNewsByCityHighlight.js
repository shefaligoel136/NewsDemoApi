const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

const { withHooks } = require('../common/hooks');

const tableName = process.env.tableName;

const handler = async (event) => {
  if (!event.pathParameters.city) {
    // failed withoud a city
    return Responses._400({
      message: "Missing the CITY from the path",
    });
  }

  const city = event.pathParameters.city;

  // query REQUEST
  const cityWiseHighlight = await Dynamo.queryByGSIKeyIndexHighlight({
    tableName,
    indexName: "city-typeNews-index",
    queryKey: "city",
    queryValue: city,
  })
  
  if (!cityWiseHighlight) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    cityWiseHighlight,
  });
};

exports.handler = withHooks(handler);