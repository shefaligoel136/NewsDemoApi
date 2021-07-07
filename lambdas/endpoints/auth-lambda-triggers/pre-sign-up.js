"use strict";

exports.handler = async (event) => {
    console.log('Received EVENT', JSON.stringify(event, null, 2));
    event.response.autoConfirmUser = true;
    // event.response.autoVerifyPhone = true;
    event.response.autoVerifyEmail = true;
    return event;
};