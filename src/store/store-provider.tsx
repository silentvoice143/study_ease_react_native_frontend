import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '.';
import { Provider } from 'react-redux';

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
