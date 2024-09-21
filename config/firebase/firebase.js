



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
    topic: "/topics/elminiawy.patisserie",
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
