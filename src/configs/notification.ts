import * as serviceWorker from '../serviceWorkerRegistration';

export const isPushNotificationSupported = serviceWorker.isPushNotificationSupported();
// check push notifications are supported by the browser

export const userConsent = serviceWorker.userConsent();

export const askUserPermission = (): void => {
  serviceWorker.askUserPermission().then((consent) => {
    if (consent === 'granted') {
      serviceWorker.createNotificationSubscription();
    }
  });
}

export const getUserSubscription = (): Promise<PushSubscription | null> => {
  return serviceWorker.getUserSubscription();
}

export function base64Encode(arrayBuffer: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer))));
}