const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

// BEFORE RUNNING THE HANDLER WE NEED TO RUN SOME HOOKS
const { withHooks } = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  // GET REQUEST
  const news = await Dynamo.getAllNews(tableName);

  console.log(newsID);
  if (!news) {
    return Responses._400({
      message: "Failed to get news",
    });
  }

  return Responses._200({
    news,
  });
};

exports.handler = withHooks(handler);
