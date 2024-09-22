var admin = require("firebase-admin");

function sanitizeTopic(userId) {
  if (userId && typeof userId === "object" && userId.toString) {
    const userIdStr = userId
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    return userIdStr;
  } else {
    return "";    
  }
}

function PushNotification(message) {
  const sanitizedUserId = sanitizeTopic(message.userId);

  if (!sanitizedUserId || sanitizedUserId.length === 0) {
    return;  
  }
  const messageContent = {
    notification: {
      title: message.title || "No Title",
      body: message.description || "No description",
    },
    android: {
      notification: {
        sound: "default",
      },
    },
    data: {
      product: message.product ? message.product.toString() : "",
      category: message.category ? message.category.toString() : "",
    },

    topic: `/topics/${sanitizedUserId}`,
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
