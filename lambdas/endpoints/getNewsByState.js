const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

const { withHooks } = require('../common/hooks');

const tableName = process.env.tableName;

const handler = async (event) => {
  if (!event.pathParameters.state) {
    // failed withoud a state
    return Responses._400({
      message: "Missing the STATE from the path",
    });
  }

  const state = event.pathParameters.state;

  // query REQUEST
  const stateNews = await Dynamo.queryByGSIKeyIndex({
    tableName,
    indexName: "state-typeNews-index",
    queryKey: "state",
    queryValue: state,
  })
  // .catch((err) => {
  //   console.log("Error in Dynamo Get", err);
  //   return null;
  // });
  console.log("stateNews",state);
  if (!stateNews) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    stateNews,
  });
};

exports.handler = withHooks(handler);