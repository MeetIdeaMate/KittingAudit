importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyC3dyTIQOofAbfyPNDR4vqUrHqZhuC1sjI",
    authDomain: "tlproductionmgmntapp.firebaseapp.com",
    projectId: "tlproductionmgmntapp",
    storageBucket: "tlproductionmgmntapp.firebasestorage.app",
    messagingSenderId: "842108721287",
    appId: "1:842108721287:web:8d0160b8f372cda75dc022",
    measurementId: "G-7BCN3HMNQ6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload?.notification?.title;
    const notificationOptions = {
        body: payload?.notification?.body,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});