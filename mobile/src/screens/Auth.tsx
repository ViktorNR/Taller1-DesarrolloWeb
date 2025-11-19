import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleRegistered = async (creds: { username: string; password: string }) => {
    try {
      await login(creds.username, creds.password);
      navigation.goBack();
    } catch (e) {
      setMode('login');
    }
  };

  const handleLoginSuccess = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, mode === 'login' && styles.tabActive]}
          onPress={() => setMode('login')}
        >
          <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'register' && styles.tabActive]}
          onPress={() => setMode('register')}
        >
          <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {mode === 'login' ? (
          <Login onSuccess={handleLoginSuccess} />
        ) : (
          <Register onRegistered={handleRegistered} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  tabs: {
    flexDirection: 'row',
    padding: SPACING.SM,
    gap: SPACING.SM,
  },
  tab: {
    flex: 1,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: UNAB_COLORS.BLANCO,
    borderWidth: 2,
    borderColor: UNAB_COLORS.AZUL,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: UNAB_COLORS.AZUL,
  },
  tabText: {
    color: UNAB_COLORS.AZUL,
    fontWeight: '600',
  },
  tabTextActive: {
    color: UNAB_COLORS.BLANCO,
  },
  content: {
    padding: SPACING.MD,
  },
});

