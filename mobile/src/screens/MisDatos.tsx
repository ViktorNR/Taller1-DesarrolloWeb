import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

type FormState = { nombre: string; apellido: string; email: string; rut: string; telefono: string };
type ErrorsState = { email?: string | null; rut?: string | null; telefono?: string | null };

export default function MisDatos() {
  const { user, updateUser } = useAuth() as any;
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ nombre: '', apellido: '', email: '', rut: '', telefono: '' });
  const [errors, setErrors] = useState<ErrorsState>({ email: null, rut: null, telefono: null });
  const [message, setMessage] = useState<string | null>(null);

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

  function validateField(field: keyof FormState, value: string) {
    if (field === 'email') {
      setErrors(e => ({ ...e, email: validateEmail(value) ? null : 'Email inválido' }));
    }
    if (field === 'rut') {
      setErrors(e => ({ ...e, rut: validateRut(value) ? null : 'RUT inválido' }));
    }
    if (field === 'telefono') {
      setErrors(e => ({ ...e, telefono: validateTelefono(value) ? null : 'Teléfono inválido (ej: +56912345678)' }));
    }
  }

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre ?? '',
        apellido: user.apellido ?? '',
        email: user.email ?? '',
        rut: formatRut(user.rut ?? ''),
        telefono: user.telefono ?? ''
      });
      setErrors({
        email: validateEmail(user.email ?? '') ? null : 'Email inválido',
        rut: validateRut(user.rut ?? '') ? null : 'RUT inválido',
        telefono: validateTelefono(user.telefono ?? '') ? null : 'Teléfono inválido (ej: +56912345678)'
      });
    }
  }, [user]);

  async function onSave() {
    if (!updateUser) return;
    setMessage(null);
    const emailOk = validateEmail(form.email);
    const rutOk = validateRut(form.rut);
    const telOk = validateTelefono(form.telefono);
    setErrors({ email: emailOk ? null : 'Email inválido', rut: rutOk ? null : 'RUT inválido', telefono: telOk ? null : 'Teléfono inválido (ej: +56912345678)' });
    if (!emailOk || !rutOk || !telOk) return;

    setLoading(true);
    try {
      await updateUser({ nombre: form.nombre, apellido: form.apellido, email: form.email, rut: form.rut, telefono: form.telefono });
      setMessage('Datos actualizados correctamente');
      setEditable(false);
    } catch (e: any) {
      setMessage('Error actualizando datos');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mis Datos</Text>
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>Debes iniciar sesión para ver tus datos.</Text>
        </View>
      </View>
    );
  }

  const hasErrors = Boolean(errors.email || errors.rut || errors.telefono);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mis Datos</Text>
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(v) => setForm(f => ({ ...f, nombre: v }))}
            editable={editable}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={form.apellido}
            onChangeText={(v) => setForm(f => ({ ...f, apellido: v }))}
            editable={editable}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={form.email}
            onChangeText={(v) => { setForm(f => ({ ...f, email: v })); validateField('email', v); }}
            editable={editable}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>RUT</Text>
          <TextInput
            style={[styles.input, errors.rut && styles.inputError]}
            value={form.rut}
            onChangeText={(v) => { const formatted = formatRut(v); setForm(f => ({ ...f, rut: formatted })); validateField('rut', formatted); }}
            editable={editable}
            placeholder="12.345.678-9"
          />
          {errors.rut && <Text style={styles.errorText}>{errors.rut}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, errors.telefono && styles.inputError]}
            value={form.telefono}
            onChangeText={(v) => { setForm(f => ({ ...f, telefono: v })); validateField('telefono', v); }}
            editable={editable}
            placeholder="+56912345678"
            keyboardType="phone-pad"
          />
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
        </View>

        <View style={styles.buttons}>
          {!editable ? (
            <TouchableOpacity style={styles.button} onPress={() => setEditable(true)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, (loading || hasErrors) && styles.buttonDisabled]}
                onPress={onSave}
                disabled={loading || hasErrors}
              >
                <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditable(false);
                  setForm({ nombre: user.nombre ?? '', apellido: user.apellido ?? '', email: user.email ?? '', rut: formatRut(user.rut ?? ''), telefono: user.telefono ?? '' });
                  setErrors({ email: null, rut: null, telefono: null });
                }}
              >
                <Text style={[styles.buttonText, { color: UNAB_COLORS.AZUL }]}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.BLANCO,
    padding: SPACING.MD,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.MD,
  },
  warningContainer: {
    backgroundColor: UNAB_COLORS.AMARILLO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  warningText: {
    color: UNAB_COLORS.GRIS_OSCURO,
  },
  messageContainer: {
    backgroundColor: UNAB_COLORS.AZUL_CLARO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.MD,
  },
  messageText: {
    color: UNAB_COLORS.AZUL,
  },
  card: {
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
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
  inputError: {
    borderColor: UNAB_COLORS.ROJO,
  },
  errorText: {
    color: UNAB_COLORS.ROJO,
    fontSize: 12,
    marginTop: SPACING.XS,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginTop: SPACING.MD,
  },
  button: {
    flex: 1,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: UNAB_COLORS.ROJO,
  },
  cancelButton: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderWidth: 2,
    borderColor: UNAB_COLORS.AZUL,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 16,
    fontWeight: '600',
  },
});

