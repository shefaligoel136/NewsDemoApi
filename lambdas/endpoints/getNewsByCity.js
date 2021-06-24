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
  const cityNews = await Dynamo.queryByGSIKeyIndex({
    tableName,
    indexName: "city-typeNews-index",
    queryKey: "city",
    queryValue: city,
  })
  // .catch((err) => {
  //   console.log("Error in Dynamo Get", err);
  //   return null;
  // });
  console.log("cityNews",city);
  if (!cityNews) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    cityNews,
  });
};

exports.handler = withHooks(handler);