async function ensureServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        return null;
    }

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
        registration = await navigator.serviceWorker.register("/demo-sw.js");
    }

    await navigator.serviceWorker.ready;
    return registration;
}

export async function requestPermission() {
    if (!("Notification" in window)) {
        throw new Error("Notifications are not supported in this browser.");
    }

    await ensureServiceWorker();

    if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            throw new Error("Notification permission was not granted.");
        }
    } else if (Notification.permission !== "granted") {
        throw new Error("Notification permission was blocked.");
    }
}

export async function sendDemo() {
    if (!("Notification" in window)) {
        throw new Error("Notifications are not supported in this browser.");
    }

    if (Notification.permission !== "granted") {
        await requestPermission();
    }

    const registration = await ensureServiceWorker();
    if (registration?.showNotification) {
        await registration.showNotification("Demo notification", {
            body: "This is a demo push notification.",
            icon: "/favicon.png"
        });
        return;
    }

    new Notification("Demo notification", {
        body: "This is a demo push notification.",
        icon: "/favicon.png"
    });
}
