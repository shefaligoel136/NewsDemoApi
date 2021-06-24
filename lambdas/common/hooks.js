const {
  useHooks,
  logEvent,
  parseEvent,
  handleUnexpectedError,
} = require("lambda-hooks");

const withHooks = useHooks({
  before: [logEvent, parseEvent], //  means any time we use these hooks, it will run logEvents and not console logs out the event
  after: [],
  onError: [handleUnexpectedError], // catches error and send response of error message back to the customer
});

// CUSTOM HOOKS TO VALIDATE BODY AND PATH PARAMETERES

const hooksWithValidation = ({ bodySchema, pathSchema }) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validateEventBody, validatePaths],
      after: [],
      onError: [handleUnexpectedError],
    },
    {
      // CONFIGS
      bodySchema,
      pathSchema,
    }
  );
};

module.exports = {
  withHooks,
  hooksWithValidation,
};

const validateEventBody = async (state) => {
  const { bodySchema } = state.config;
  if (!bodySchema) {
    throw Error("Missing the required body schema");
  }

  try {
    const { event } = state;

    // if event body matches the body schema it will work else will hit catch
    await bodySchema.validate(event.body, {
      strict: true,
    });
  } catch (error) {
    console.log("event.body Validation Error", error);

    // TELLING SOMETHING IS WRONG AND WE NEED TO STOP RUNNING THE LAMBDA
    state.exit = true;
    state.response = {  
      statusCode: 400,
      body: JSON.stringify({ "error in hooks": error }),
    };
  }

  return state;
};

const validatePaths = async (state) => {
    const { pathSchema } = state.config;
    if (!pathSchema) {
      throw Error("Missing the required path schema");
    }
  
    try {
      const { event } = state;
  
      // if event body matches the body schema it will work else will hit catch
      await pathSchema.validate(event.pathParameters, {
        strict: true,
      });
    } catch (error) {
      console.log("event.pathParameters Validation Error", error);
  
      // TELLING SOMETHING IS WRONG AND WE NEED TO STOP RUNNING THE LAMBDA
      state.exit = true;
      state.response = {
        statusCode: 400,
        body: JSON.stringify({ "error in hooks" : error }),
      };
    }
  
    return state;
  };
