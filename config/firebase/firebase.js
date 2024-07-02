const admin = require("firebase-admin");



console.log(process.env.PROJECT_ID)
//connect with db
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.type,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.private_key_id,
    private_key: process.env.PRIVATE_KEY, 
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
  })
});

function PushNotification(message) {
  const messageContent = {
    notification: {
      title: message.title,
      body: message.body,
    },
    android: {
      notification: {
        sound: "default",
      },
    },
    data: {
      product: message.product,
      category: message.category,
    },
    topic: "/topics/finder",
  };

  admin
    .messaging()
    .send(messageContent)
    .then((response) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Successfully sent message", response);
      }
    })
    .catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Error sending message", error);
      }
    });
}


module.exports = PushNotification;
