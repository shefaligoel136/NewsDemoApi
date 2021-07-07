const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });
const SES = new AWS.SES();
const SNS = new AWS.SNS();

exports.handler = async (event) => {
  let secretLoginCode;

  if (!event.request.session || !event.request.session.length) {
    secretLoginCode = Date.now().toString().slice(-4);
    console.log("OTP / Secret Login Code: " + secretLoginCode);

    try {
      if ("phone_number" in event.request.userAttributes) {
        await sendSMSviaSNS(
          event.request.userAttributes.phone_number,
          secretLoginCode
        );
      }

      if ("email" in event.request.userAttributes) {
        const emailResult = await SES.sendEmail(
          (params = {
            Destination: {
              ToAddresses: [event.request.userAttributes.email],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: `<html>
                            <body>
                                <p>Your secrect login code is: </p>
                                <h3>${secretLoginCode}</h3>
                            </body>
                          </html`,
                },
                Text: {
                  Charset: "UTF-8",
                  Data: `Your secrect login code is: ${secretLoginCode}`,
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "Your secrect login code",
              },
            },
            Source: "talktoshefali136@gmail.com",
          })
        ).promise();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  } else {
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode =
      previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
  }

  event.response.privateChallengeParameters = { secretLoginCode };
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

function sendSMSviaSNS(phone, code) {
  const params = {
    Message: code /* required */,
    PhoneNumber: phone,
  };

  return SNS({ apiVersion: "2010-03-31" }).publish(params).promise();
}
