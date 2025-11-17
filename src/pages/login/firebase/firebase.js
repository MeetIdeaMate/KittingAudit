import { initializeApp } from '@firebase/app';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';
import { showToast } from '../../../components/UiToastNotification';

const firebaseConfig = {
    apiKey: "AIzaSyC3dyTIQOofAbfyPNDR4vqUrHqZhuC1sjI",
    authDomain: "tlproductionmgmntapp.firebaseapp.com",
    projectId: "tlproductionmgmntapp",
    storageBucket: "tlproductionmgmntapp.firebasestorage.app",
    messagingSenderId: "842108721287",
    appId: "1:842108721287:web:8d0160b8f372cda75dc022",
    measurementId: "G-7BCN3HMNQ6"
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const setupNotifications = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging);
            sessionStorage.setItem("deviceToken", token);
        } else if (permission === "denied") {
            showToast.error("Error", 'You have denied notifications. Please go to your browser settings to enable them.');
        }

        onMessage(messaging, (payload) => {
            getNotification(payload);
            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
            };
            const notification = new Notification(notificationTitle, notificationOptions);
            sessionStorage.setItem("messageId", payload.messageId);
            if (payload.messageId) {
                notification.onclick = () => {
                    const targetPath = payload.path || window.location.href;
                    if (window.location.href !== targetPath) {
                        window.location.assign(targetPath);
                    } else {
                        window.focus();
                        window.location.reload();
                        sessionStorage.setItem("notification", JSON.stringify(payload));
                    }
                };
            }
        });

    } catch (error) {
        showToast.error("Error", error);
    }
};

const getNotification = (payload) => {
    const dbRequest = indexedDB.open("NotificationDB", 2);
    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("notifications")) {
            db.createObjectStore("notifications", { keyPath: "key" });
        }
    };
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["notifications"], "readwrite");
        const store = transaction.objectStore("notifications");

        const payloadData = {
            ...payload,
            key: "1",
        };
        const putRequest = store.put(payloadData);
        putRequest.onsuccess = () => { };
        putRequest.onerror = (errorEvent) => { };
    };
    dbRequest.onerror = (event) => {
        showToast.error("Error", event.target.error);
    };
}

const readNotificationData = (messageId) => {
    const dbRequest = indexedDB.open("NotificationDB", 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        if (db.objectStoreNames.contains("notifications")) {
            const transaction = db.transaction(["notifications"], "readonly");
            const store = transaction.objectStore("notifications");

            const getRequest = store.get(messageId);
            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    sessionStorage.setItem("notification", JSON.stringify(getRequest.result));
                    clearAllNotifications();
                }
            };
            getRequest.onerror = (errorEvent) => {
                showToast.error("Error", errorEvent.target.error);
            };
        }
    };
    dbRequest.onerror = (event) => {
        showToast.error("Error opening IndexedDB", event.target.error);
    };
}

const clearAllNotifications = () => {
    const dbRequest = indexedDB.open("NotificationDB", 1);
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["notifications"], "readwrite");
        const store = transaction.objectStore("notifications");
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => { };
        clearRequest.onerror = (errorEvent) => {
            showToast.error("Error", errorEvent.target.error);
        };
    };

    dbRequest.onerror = (event) => {
        showToast.error("Error", event.target.error);
    };
}

export { messaging, setupNotifications, readNotificationData, clearAllNotifications, };