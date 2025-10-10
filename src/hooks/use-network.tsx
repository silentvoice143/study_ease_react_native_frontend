import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isNetConnected, setIsNetConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsNetConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  return isNetConnected;
};
