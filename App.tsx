/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  asyncStoragePersister,
  queryClient,
} from './src/services/query-client';
import StoreProvider from './src/store/store-provider';
import AppNavigator from './src/routes/app-navigator';
import ToastManager from 'toastify-react-native';

function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <AppNavigator />
          <ToastManager />
        </PersistQueryClientProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
