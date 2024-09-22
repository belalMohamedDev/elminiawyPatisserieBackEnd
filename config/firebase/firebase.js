var admin = require("firebase-admin");

// function PushNotification(message) {
//   const messageContent = {
//     notification: {
//       title: message.title || "No Title",
//       body: message.description || "No description",
//     },
//     android: {
//       notification: {
//         sound: "default",
//       },
//     },
//     data: {
//       product: message.product ? message.product.toString() : "",
//       category: message.category ? message.category.toString() : "",
//     },
//     topic: "/topics/elminiawy.patisserie",
//   };

//   admin
//     .messaging()
//     .send(messageContent)
//     .then((response) => {
//       if (process.env.NODE_ENV === "development") {
//         console.log("Successfully sent message", response);
//       }
//     })
//     .catch((error) => {
//       if (process.env.NODE_ENV === "development") {
//         console.log("Error sending message", error);
//       }
//     });
// }

function sanitizeTopic(userId) {
  return userId.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function PushNotification(message) {
  const sanitizedUserId = sanitizeTopic(message.userId);

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
