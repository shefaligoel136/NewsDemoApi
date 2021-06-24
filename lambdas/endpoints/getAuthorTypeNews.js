const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

const { withHooks } = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  if (!event.pathParameters.author) {
    // failed withoud a state
    return Responses._400({
      message: "Missing the AUTHOR from the path",
    });
  }

  const author = event.pathParameters.author;
  const typeNews = event.pathParameters.typeNews;

  // query REQUEST
  const authorTypeNews = await Dynamo.queryByGSIKeyIndexNewsType({
    tableName,
    indexName: "author-typeNews-index",
    queryKey: "author",
    queryValue: author,
    rangeKey: "typeNews",
    rangeValue: typeNews,
  });
  
  console.log("authorTypeNews", author);
  if (!authorTypeNews) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    authorTypeNews,
  });
};

exports.handler = withHooks(handler);
