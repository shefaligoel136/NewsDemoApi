const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");
const yup = require("yup");

const { withHooks} = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  // console.log("Event", event);

  let newsID = event.pathParameters.ID;

  // WHEN API GATEWAY PASSES THE BODY THROUGH A LAMBDA IT STRINGIFIES THE BODY, SO WE NEED TO USE JSON.parse

  const response = await Dynamo.updateHighlight({
    tableName,
    primaryKey: "newsID",
    primaryKeyValue: newsID,
  });

  return Responses._200({
    response,
  });
};

exports.handler = withHooks(handler);