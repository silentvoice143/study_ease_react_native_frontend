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
import { Fonts } from './src/theme/fonts';
import Home from './src/screens/home';
import AppNavigator from './src/routes/app-navigator';

function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <AppNavigator />
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
