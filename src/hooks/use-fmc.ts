import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
// import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
// import { registerDevice } from '../store/deviceSlice';
import notifee, { AndroidImportance } from '@notifee/react-native';

/**
 * Get FCM token for push notifications
 * @returns string | null
 */
export async function getFcmToken(): Promise<string | null> {
  try {
    // Request permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('Push notification permission not granted');
      return null;
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

interface UseFcmOptions {
  enabled?: boolean;
  dependencies?: any[];
  onMessage?: (remoteMessage: any) => void;
  onNotificationOpened?: (remoteMessage: any) => void;
  onInitialNotification?: (remoteMessage: any) => void;
}

export function useFcmSetup({
  enabled = true,
  dependencies = [],
  onMessage,
  onNotificationOpened,
  onInitialNotification,
}: UseFcmOptions) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const createNotificationChannel = async () => {
      try {
        await notifee.createChannel({
          id: 'high_importance_channel',
          name: 'High Importance Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });
        console.log('Notification channel created');
      } catch (err) {
        console.error('Error creating notification channel:', err);
      }
    };

    const setupPush = async () => {
      try {
        const token = await getFcmToken();
        if (token) {
          // Send token to backend
          // const payload = await dispatch(registerDevice({ deviceToken: token })).unwrap();

          // if (payload.success) {
          //   Toast.show({
          //     type: 'success',
          //     text1: 'Device registered successfully',
          //   });
          // }
          console.log('FCM Token:', token);
        } else {
          // Toast.show({
          //   type: 'info',
          //   text1: 'No FCM token retrieved',
          // });
          console.log('No FCM token retrieved');
        }
      } catch (err) {
        console.error('Error while setting up push notifications:', err);
      }
    };

    // Run channel creation + push setup
    createNotificationChannel();
    setupPush();

    // Foreground notification
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
      if (onMessage) {
        onMessage(remoteMessage);
      } else {
        // Toast.show({
        //   type: 'info',
        //   text1: remoteMessage.notification?.title ?? 'New Message',
        //   text2: remoteMessage.notification?.body ?? '',
        // });
      }
    });

    // App opened from background
    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('App opened from background:', remoteMessage.notification);
        if (onNotificationOpened) onNotificationOpened(remoteMessage);
      },
    );

    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'App opened from quit state:',
            remoteMessage.notification,
          );
          if (onInitialNotification) onInitialNotification(remoteMessage);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies]);
}

///================usage======================///

// useFcmSetup({
//   // Run only if user is authenticated
//   enabled: isAuthenticated,

//   // Re-run hook if authentication state changes
//   dependencies: [isAuthenticated],

//   // Foreground notification handler
//   onMessage: remoteMessage => {
//     console.log('Foreground Notification:', remoteMessage);
//     // Example: show custom alert or navigate
//     if (remoteMessage.data?.screen) {
//       navigation.navigate(remoteMessage.data.screen, { ...remoteMessage.data });
//     }
//   },

//   // App opened from background
//   onNotificationOpened: remoteMessage => {
//     console.log('Background Notification opened:', remoteMessage.notification);
//     if (remoteMessage.data?.screen) {
//       navigation.navigate(remoteMessage.data.screen, { ...remoteMessage.data });
//     }
//   },

//   // App opened from quit state
//   onInitialNotification: remoteMessage => {
//     console.log('Quit state Notification opened:', remoteMessage.notification);
//     if (remoteMessage.data?.screen) {
//       navigation.navigate(remoteMessage.data.screen, { ...remoteMessage.data });
//     }
//   },
// });
