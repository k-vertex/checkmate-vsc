const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendPushNotification = () => {
    const message = {
        data: {
          score: '850',
          time: '2:45'
        },
        token: 'fvTsmOU1SOeyYAjdTNoXCO:APA91bEN0woBFlTWH-TGLLLILwAtU5IlsLH368lQwaes5qdcOliAjL-vdXsqO1a42anmDfPLLAiQHbJVlhNr3IMXLKzVI8Rd6xxDVcSQNQHNsZrfgnanjKk'
      };
    admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}