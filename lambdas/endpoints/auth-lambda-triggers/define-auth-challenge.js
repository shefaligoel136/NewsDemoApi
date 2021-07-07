"use strict";

exports.handler = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));

  // IF USER IS NOT REGISTERED
  if (event.request.userNotFound) {
    event.response.issueToken = false;
    event.response.failAuthentication = true;
    throw new Error("User does not exist");
  }
  
  // WRONG OTP EVEN AFTER 3 SESSIONS?
  if (
    event.request.session.length >= 3 &&
    event.request.session.slice(-1)[0].challengeResult === false
  ) {
    event.response.issueToken = false;
    event.response.failAuthentication = true;
    throw new Error("Invalid OTP");

    // Correct OTP!
  } else if (
    event.request.session.length > 0 &&
    event.request.session.slice(-1)[0].challengeResult === true
  ) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;

    // not yet received correct OTP
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  }

  return event;
};
