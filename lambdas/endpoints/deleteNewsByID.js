const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");

// BEFORE RUNNING THE HANDLER WE NEED TO RUN SOME HOOKS
const { withHooks } = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  // console.log('Event',event);

  if (!event.pathParameters.ID) {
    // failed withoud an ID
    return Responses._400({
      message: "Missing the ID from the path",
    });
  }

  let newsID = event.pathParameters.ID;

  // DELETE REQUEST
  const newsUpdate = await Dynamo.deleteByID(newsID, tableName);

  if (!newsUpdate) {
    return Responses._400({
      message: "Failed to get news by id",
    });
  }

  return Responses._200({
    newsUpdate,
  });
};

exports.handler = withHooks(handler);
