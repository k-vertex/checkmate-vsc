const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = (title, content, token) => {
    const message = {
        notification: {
          title: title,
          body: content
        },
        token: token
      };
    admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}

module.exports = sendPushNotification;