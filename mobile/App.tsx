import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { StoreProvider } from './src/context/StoreContext';
import { UIProvider } from './src/context/UIContext';
import { FiltersProvider } from './src/context/FiltersContext';
import { AuthProvider } from './src/context/AuthContext';
import { UNAB_COLORS } from './src/styles/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UIProvider>
          <StoreProvider>
            <FiltersProvider>
              <AuthProvider>
                <StatusBar style="light" backgroundColor={UNAB_COLORS.AZUL} />
                <AppNavigator />
                <Toast />
              </AuthProvider>
            </FiltersProvider>
          </StoreProvider>
        </UIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

