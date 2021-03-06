const moment = require('moment');



function messageFormat(username, text, type){

    return {
        username,
        text,
        time: moment().format('h:mm a'),
        type
    }
}

module.exports = messageFormat;
