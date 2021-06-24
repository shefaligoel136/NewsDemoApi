const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

const { withHooks } = require('../common/hooks');

const tableName = process.env.tableName;

const handler = async (event) => {
  if (!event.pathParameters.author) {
    // failed withoud a author
    return Responses._400({
      message: "Missing the AUTHOR from the path",
    });
  }

  const author = event.pathParameters.author;

  // query REQUEST
  const authorWiseHighlight = await Dynamo.queryByGSIKeyIndexHighlight({
    tableName,
    indexName: "author-typeNews-index",
    queryKey: "author",
    queryValue: author,
  })
  
  if (!authorWiseHighlight) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    authorWiseHighlight,
  });
};

exports.handler = withHooks(handler);