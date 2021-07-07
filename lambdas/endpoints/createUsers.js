const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");
const yup = require("yup");

const { withHooks, hooksWithValidation } = require("../common/hooks");

const tableName = process.env.userTableName;

const bodySchema = yup.object().shape({
  userID: yup.string().required(),
  city: yup.string().required(),
  email: yup.string().required(),
  username: yup.string().required(),
});

const pathSchema = yup.object().shape({});

const handler = async (event) => {
  const user = event.body;  

  // ADD CODE TO DYNAMO
  const newUser = await Dynamo.writeUser(user, tableName);
  // .catch((err) => {
  //   console.log("Error in dynamo write", err);
  //   return null;
  // });

  if (!newUser) {
    return Responses._400({
      message: "Failed to create user",
    });
  }

  return Responses._200({
    newUser,
  });
};

exports.handler = hooksWithValidation({ bodySchema, pathSchema })(handler);
