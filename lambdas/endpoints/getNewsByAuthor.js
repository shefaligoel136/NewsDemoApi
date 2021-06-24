const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

const { withHooks } = require("../common/hooks");

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
  const authorNews = await Dynamo.queryByGSIKeyIndex({
    tableName,
    indexName: "author-typeNews-index",
    queryKey: "author",
    queryValue: author,
  });
  // .catch((err) => {
  //   console.log("Error in Dynamo Get", err);
  //   return null;
  // });
  console.log("authorNews", author);
  if (!authorNews) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    authorNews,
  });
};

exports.handler = withHooks(handler);
