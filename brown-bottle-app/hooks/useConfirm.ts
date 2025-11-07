import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirm() hook.
 * - Uses native Alert on iOS/Android
 * - Uses browser confirm() on Web
 * - Returns a Promise<boolean> for async/await
 */
export function useConfirm() {
  const confirm = (title: string, message?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        // Use browser confirm for web
        const ok = window.confirm(`${title}\n\n${message || ''}`);
        resolve(ok);
      } else {
        // Use native alert for mobile
        Alert.alert(
          title,
          message,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Confirm', onPress: () => resolve(true) },
          ],
          { cancelable: true }
        );
      }
    });
  };

  return { confirm };
}
