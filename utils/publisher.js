const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({ region: "us-east-1" });
const sns = new AWS.SNS();

function publishMessage(message) {
  // const topicArn = "arn:aws:sns:us-east-1:781104868468:my-SNStopic-ff386d5";

  const params = {
    Message: message,
    TopicArn: process.env.SNS_TOPIC,
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.log("Error publishing message:", err);
    } else {
      console.log("Message published successfully:", data.MessageId);
    }
  });
}

module.exports = {
  publishMessage,
};
