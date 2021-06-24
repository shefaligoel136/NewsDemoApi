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
  const stateWiseHighlight = await Dynamo.queryByGSIKeyIndexHighlight({
    tableName,
    indexName: "state-typeNews-index",
    queryKey: "state",
    queryValue: state,
  })
  
  if (!stateWiseHighlight) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    stateWiseHighlight,
  });
};

exports.handler = withHooks(handler);