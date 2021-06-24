const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");
const yup = require("yup");

const { withHooks, hooksWithValidation } = require("../common/hooks");

const tableName = process.env.tableName;

const bodySchema = yup.object().shape({
  description: yup.string().required(),
});

const pathSchema = yup.object().shape({
    ID: yup.string().required()
});

const handler = async (event) => {
  // console.log("Event", event);

  let newsID = event.pathParameters.ID;

  // WHEN API GATEWAY PASSES THE BODY THROUGH A LAMBDA IT STRINGIFIES THE BODY, SO WE NEED TO USE JSON.parse
  const {description} = event.body;
  
  const response = await Dynamo.updateData({
      tableName,
      primaryKey: 'newsID',
      primaryKeyValue: newsID,
      updateKey: 'description',
      updateValue: description,
  })

  return Responses._200({
    response,
  });
};

exports.handler = hooksWithValidation({ bodySchema, pathSchema })(handler);
