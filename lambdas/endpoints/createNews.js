const Responses = require("../common/API_responses");
const Dynamo = require("../common/Dynamo");
const yup = require('yup');

const { withHooks, hooksWithValidation } = require("../common/hooks");


const monotonicFactory = require("ulid").monotonicFactory;
const ulid = monotonicFactory();

const tableName = process.env.tableName;

const bodySchema = yup.object().shape({
  // newsID: yup.string().required(),
  author: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  title: yup.string().required(),
  typeNews: yup.string().required(),
  description: yup.string().required(),
  // timestamp: yup.number().required(),
  highlight: yup.number(),
  // reports: yup.map(),
  totalShare: yup.number(),
});

const pathSchema = yup.object().shape({});

const handler = async (event) => {
  // console.log("Event", event);

  //   let newsID = event.pathParameters.ID;

  // WHEN API GATEWAY PASSES THE BODY THROUGH A LAMBDA IT STRINGIFIES THE BODY, SO WE NEED TO USE JSON.parse
  const news = event.body;

  news.newsID = ulid();
  news.timeStamp = new Date().getTime();

  // ADD CODE TO DYNAMO
  const newNews = await Dynamo.write(news, tableName);
  // .catch((err) => {
  //   console.log("Error in dynamo write", err);
  //   return null;
  // });

  if (!newNews) {
    return Responses._400({
      message: "Failed to write news",
    });
  }

  return Responses._200({
    newNews,
  });
};

exports.handler = hooksWithValidation({ bodySchema, pathSchema })(handler);
