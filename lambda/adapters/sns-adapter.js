'use strict';
const AWS = require('aws-sdk');

function buildSNS() {
    return new AWS.SNS();
}

async function publishSnsMessage(payload, topicArn) {
    const sns = buildSNS();

    const params = {
        Message: JSON.stringify(payload),
        TopicArn: topicArn,
    };
    await sns.publish(params).promise();
}

module.exports = {publishSnsMessage};
