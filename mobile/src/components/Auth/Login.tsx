import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../../styles/theme';

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const onSubmit = async () => {
    setError(null);
    if (!username || !password) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorDetail = err?.response?.data?.detail;
      let errorMessage: string;
      
      if (typeof errorDetail === 'object' && errorDetail !== null) {
        errorMessage = Object.entries(errorDetail)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      } else if (errorDetail) {
        errorMessage = String(errorDetail);
      } else {
        errorMessage = String(err?.message || err || 'Error desconocido');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Ingresa tu usuario"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.passwordToggleText}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.MD,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.LG,
  },
  inputContainer: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.GRIS_OSCURO,
    marginBottom: SPACING.SM,
  },
  input: {
    borderWidth: 1,
    borderColor: UNAB_COLORS.GRIS,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    fontSize: 16,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: UNAB_COLORS.GRIS,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.MD,
    fontSize: 16,
  },
  passwordToggle: {
    padding: SPACING.MD,
  },
  passwordToggleText: {
    fontSize: 20,
  },
  errorContainer: {
    backgroundColor: UNAB_COLORS.ROJO_CLARO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.MD,
  },
  errorText: {
    color: UNAB_COLORS.ROJO_OSCURO,
    fontSize: 14,
  },
  button: {
    backgroundColor: UNAB_COLORS.AZUL,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 18,
    fontWeight: '600',
  },
});

