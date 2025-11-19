import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { registerUser } from '../../api/api';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../../styles/theme';

interface RegisterProps {
  onRegistered?: (creds: { username: string; password: string }) => void;
}

type ErrorsState = { email?: string | null; rut?: string | null; telefono?: string | null };

export default function Register({ onRegistered }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRules, setPasswordRules] = useState({ length: false, upper: false, lower: false, number: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorsState>({ email: null, rut: null, telefono: null });

  function validateEmail(value: string) {
    if (!value) return false;
    const re = /^[\w.!#$%&'*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;
    return re.test(value);
  }

  function cleanRut(value: string) {
    return value.replace(/[^0-9kK]/g, '').toUpperCase();
  }

  function validateRut(value: string) {
    if (!value) return false;
    const rut = cleanRut(value);
    if (rut.length < 2) return false;
    const dv = rut.slice(-1);
    const num = rut.slice(0, -1);
    let sum = 0;
    let mul = 2;
    for (let i = num.length - 1; i >= 0; i--) {
      sum += parseInt(num.charAt(i), 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    const res = 11 - (sum % 11);
    let dvExpected = '';
    if (res === 11) dvExpected = '0';
    else if (res === 10) dvExpected = 'K';
    else dvExpected = String(res);
    return dvExpected === dv;
  }

  function formatRut(value: string) {
    if (!value) return '';
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!cleaned) return '';
    if (cleaned.length === 1) return cleaned;
    const dv = cleaned.slice(-1);
    const num = cleaned.slice(0, -1);
    const numFormatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${numFormatted}-${dv}`;
  }

  function validateTelefono(value: string) {
    if (!value) return false;
    const re = /^\+569\d{8}$/;
    return re.test(value);
  }

  function validatePasswordRules(pw: string) {
    return {
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw)
    };
  }

  function validateField(field: 'email' | 'rut' | 'telefono', value: string) {
    if (field === 'email') setErrors(e => ({ ...e, email: validateEmail(value) ? null : 'Email inválido' }));
    if (field === 'rut') setErrors(e => ({ ...e, rut: validateRut(value) ? null : 'RUT inválido' }));
    if (field === 'telefono') setErrors(e => ({ ...e, telefono: validateTelefono(value) ? null : 'Teléfono inválido (ej: +56912345678)' }));
  }

  const hasErrors = Boolean(errors.email || errors.rut || errors.telefono);
  const passwordValid = Object.values(passwordRules).every(Boolean);
  const incomplete = !email || !username || !password || !telefono || !nombre || !apellido || !rut;

  const onSubmit = async () => {
    setError(null);
    if (!email || !username || !password) {
      setError('Email, username y contraseña son requeridos');
      return;
    }

    const pwRules = validatePasswordRules(password);
    setPasswordRules(pwRules);
    const pwOk = pwRules.length && pwRules.upper && pwRules.lower && pwRules.number;
    if (!pwOk) {
      setError('La contraseña no cumple los requisitos');
      return;
    }

    const emailOk = validateEmail(email);
    const rutOk = validateRut(rut);
    const telOk = telefono ? validateTelefono(telefono) : true;
    setErrors({ email: emailOk ? null : 'Email inválido', rut: rutOk ? null : 'RUT inválido', telefono: telOk ? null : 'Teléfono inválido (ej: +56912345678)' });
    if (!emailOk || !rutOk || !telOk) return;

    setLoading(true);
    try {
      const payload: any = { email, username, nombre, apellido, password };
      if (rut) payload.rut = cleanRut(rut);
      if (telefono) payload.telefono = telefono;
      await registerUser(payload);
      if (onRegistered) {
        onRegistered({ username, password });
      }
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={(v) => { setEmail(v); validateField('email', v); }}
          placeholder="mail@ejemplo.cl"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Ingresa tu usuario"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.SM }]}>
          <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.label}>Apellido <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>RUT <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.rut && styles.inputError]}
          value={rut}
          onChangeText={(v) => { const formatted = formatRut(v); setRut(formatted); validateField('rut', formatted); }}
          placeholder="12.345.678-9"
        />
        {errors.rut && <Text style={styles.errorText}>{errors.rut}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.telefono && styles.inputError]}
          value={telefono}
          onChangeText={(v) => { setTelefono(v); validateField('telefono', v); }}
          placeholder="+56912345678"
          keyboardType="phone-pad"
        />
        {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña <Text style={styles.required}>*</Text></Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, !passwordValid && password && styles.inputError]}
            value={password}
            onChangeText={(v) => { setPassword(v); setPasswordRules(validatePasswordRules(v)); }}
            placeholder="Contraseña"
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
        <View style={styles.passwordRules}>
          <Text style={[styles.ruleText, passwordRules.length && styles.ruleTextValid]}>
            • Mínimo 8 caracteres
          </Text>
          <Text style={[styles.ruleText, passwordRules.upper && styles.ruleTextValid]}>
            • Al menos una mayúscula
          </Text>
          <Text style={[styles.ruleText, passwordRules.lower && styles.ruleTextValid]}>
            • Al menos una minúscula
          </Text>
          <Text style={[styles.ruleText, passwordRules.number && styles.ruleTextValid]}>
            • Al menos un número
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, (loading || hasErrors || !passwordValid || incomplete) && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading || hasErrors || !passwordValid || incomplete}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.GRIS_OSCURO,
    marginBottom: SPACING.SM,
  },
  required: {
    color: UNAB_COLORS.ROJO,
  },
  input: {
    borderWidth: 1,
    borderColor: UNAB_COLORS.GRIS,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    fontSize: 16,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  inputError: {
    borderColor: UNAB_COLORS.ROJO,
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
  passwordRules: {
    marginTop: SPACING.SM,
  },
  ruleText: {
    fontSize: 12,
    color: UNAB_COLORS.ROJO,
  },
  ruleTextValid: {
    color: UNAB_COLORS.VERDE,
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

