import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { createDocumento, createDetalleDocumento } from '../api/api';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

interface CheckoutProps {
  onClose: () => void;
}

type DatosPersonales = {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
};

type Direccion = {
  direccion?: string;
  codigoPostal?: string;
  comuna?: string;
  ciudad?: string;
};

type OpcionEnvio = {
  id: string | number;
  nombre: string;
  descripcion?: string;
  tiempo?: string;
  precio: number;
};

export default function Checkout({ onClose }: CheckoutProps) {
  const { cart, removeFromCart } = useStore();
  const { user } = useAuth();
  const [datos, setDatos] = useState<DatosPersonales>({ nombre: '', rut: '', email: '', telefono: '' });
  const [direccion, setDireccion] = useState<Direccion>({});
  const [opcionesEnvio, setOpcionesEnvio] = useState<OpcionEnvio[]>([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionEnvio | null>(null);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<any>(null);
  const [successOrder, setSuccessOrder] = useState<{ numero: string; total: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar opciones de envío (hardcodeadas por ahora)
    setOpcionesEnvio([
      { id: 1, nombre: 'Retiro en Campus UNAB', precio: 0, tiempo: 'Inmediato' },
      { id: 2, nombre: 'Envío Estándar', precio: 5000, tiempo: '3-5 días hábiles' },
      { id: 3, nombre: 'Envío Express', precio: 10000, tiempo: '1-2 días hábiles' },
    ]);
  }, []);

  useEffect(() => {
    if (user) {
      const nombreCompleto = [user.nombre, user.apellido].filter(Boolean).join(' ').trim();
      setDatos(d => ({
        ...d,
        nombre: nombreCompleto || d.nombre,
        email: (user.email ?? d.email),
        rut: (user as any).rut ?? d.rut,
        telefono: (user as any).telefono ?? d.telefono
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((s, p) => s + (p.precio ?? 0) * (p.cantidad ?? 1), 0);

  function formatearPrecio(v: number) { return v.toLocaleString(); }

  function validateEmail(value: string) {
    if (!value) return false;
    const re = /^[\w.!#$%&'*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;
    return re.test(value);
  }

  function validateRut(value: string) {
    if (!value) return false;
    const rut = value.replace(/[^0-9kK]/g, '').toUpperCase();
    return rut.length >= 2;
  }

  function validateTelefono(value: string) {
    if (!value) return false;
    const re = /^\+569\d{8}$/;
    return re.test(value);
  }

  const requiresShippingAddress = opcionSeleccionada && opcionSeleccionada.nombre.toLowerCase() !== 'retiro en campus unab';
  const isShippingAddressComplete = !requiresShippingAddress || (
    direccion.direccion?.trim() &&
    direccion.codigoPostal?.trim() &&
    direccion.comuna?.trim() &&
    direccion.ciudad?.trim()
  );

  function getTotalConEnvio() {
    const envio = opcionSeleccionada?.precio ?? 0;
    const descuento = cuponAplicado?.descuento ?? 0;
    return subtotal + envio - descuento;
  }

  async function confirmarCompra() {
    if (!user || cart.length === 0) {
      setError('Debes estar autenticado y tener items en el carrito');
      return;
    }

    if (!validateEmail(datos.email) || !validateRut(datos.rut) || !validateTelefono(datos.telefono)) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    if (!opcionSeleccionada || !isShippingAddressComplete) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const documentoPayload = {
        titulo: "Orden de compra",
        usuario_id: user.id,
        estado: 'completado',
        direccion: direccion,
        envio: opcionSeleccionada,
        cupon: cuponAplicado,
        datosPersonales: datos,
        monto_total: getTotalConEnvio()
      };

    const documentoPayloadNotInUse: any = {
      estado: 'completado',
      monto_total: getTotalConEnvio()
    };

    if (direccion && typeof direccion === 'object') {
      documentoPayload.direccion = direccion;
    }

    if (opcionSeleccionada && typeof opcionSeleccionada === 'object') {
      documentoPayload.envio = opcionSeleccionada;
    }

    if (cuponAplicado && typeof cuponAplicado === 'object') {
      documentoPayload.cupon = cuponAplicado;
    }

    if (datos && typeof datos === 'object') {
      documentoPayload.datosPersonales = datos;
    }

    console.log('Payload de documento:', documentoPayload);

      const documento = await createDocumento(documentoPayload);
      
      const detallesPromises = cart.map(item =>
        createDetalleDocumento(
          documento.id,
          item.nombre,
          item.precio,
          item.cantidad
        )
      );

      await Promise.all(detallesPromises);

      const orden = {
        numero: documento.id.substring(0, 8).toUpperCase(),
        total: getTotalConEnvio()
      };
      setSuccessOrder(orden);

      cart.forEach(item => removeFromCart(item.id));
    } catch (err: any) {
      console.log(JSON.stringify(err.response.data, null, 2));
      console.error('Error al confirmar compra:', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Error al procesar la compra. Por favor, intenta nuevamente.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleSuccessAndClose = () => {
    setSuccessOrder(null);
    onClose();
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🛒 Finalizar Compra</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {!user && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Debes iniciar sesión para poder completar la compra.
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text style={styles.errorClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo *"
            value={datos.nombre}
            onChangeText={(v) => setDatos(d => ({ ...d, nombre: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="RUT (12.345.678-9) *"
            value={datos.rut}
            onChangeText={(v) => setDatos(d => ({ ...d, rut: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={datos.email}
            onChangeText={(v) => setDatos(d => ({ ...d, email: v }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono (+56912345678) *"
            value={datos.telefono}
            onChangeText={(v) => setDatos(d => ({ ...d, telefono: v }))}
            keyboardType="phone-pad"
          />
        </View>

        {requiresShippingAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dirección de Envío</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección *"
              value={direccion.direccion ?? ''}
              onChangeText={(v) => setDireccion(d => ({ ...d, direccion: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Código Postal *"
              value={direccion.codigoPostal ?? ''}
              onChangeText={(v) => setDireccion(d => ({ ...d, codigoPostal: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Comuna *"
              value={direccion.comuna ?? ''}
              onChangeText={(v) => setDireccion(d => ({ ...d, comuna: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Ciudad *"
              value={direccion.ciudad ?? ''}
              onChangeText={(v) => setDireccion(d => ({ ...d, ciudad: v }))}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opciones de Envío</Text>
          {opcionesEnvio.map(opcion => (
            <TouchableOpacity
              key={opcion.id}
              style={[
                styles.envioOption,
                opcionSeleccionada?.id === opcion.id && styles.envioOptionSelected
              ]}
              onPress={() => setOpcionSeleccionada(opcion)}
            >
              <View style={styles.envioOptionContent}>
                <View>
                  <Text style={styles.envioOptionName}>{opcion.nombre}</Text>
                  <Text style={styles.envioOptionDesc}>{opcion.tiempo}</Text>
                </View>
                <Text style={styles.envioOptionPrice}>${formatearPrecio(opcion.precio)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Compra</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.resumenItem}>
              <View>
                <Text style={styles.resumenItemName}>{item.nombre}</Text>
                <Text style={styles.resumenItemCantidad}>Cantidad: {item.cantidad}</Text>
              </View>
              <Text style={styles.resumenItemPrice}>
                ${formatearPrecio((item.precio ?? 0) * (item.cantidad ?? 1))}
              </Text>
            </View>
          ))}
          <View style={styles.resumenItem}>
            <Text>Subtotal</Text>
            <Text>${formatearPrecio(subtotal)}</Text>
          </View>
          {opcionSeleccionada && (
            <View style={styles.resumenItem}>
              <Text>Envío ({opcionSeleccionada.nombre})</Text>
              <Text>${formatearPrecio(opcionSeleccionada.precio)}</Text>
            </View>
          )}
          <View style={[styles.resumenItem, styles.resumenTotal]}>
            <Text style={styles.resumenTotalText}>Total</Text>
            <Text style={styles.resumenTotalText}>${formatearPrecio(getTotalConEnvio())}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
          onPress={confirmarCompra}
          disabled={isProcessing || !user || cart.length === 0}
        >
          <Text style={styles.confirmButtonText}>
            {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {successOrder && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.successBackdrop}>
            <View style={styles.successContent}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>¡Compra Realizada con Éxito!</Text>
              <Text style={styles.successText}>
                Tu pedido ha sido procesado correctamente.
              </Text>
              <View style={styles.successDetails}>
                <Text style={styles.successDetailText}>
                  <Text style={styles.successDetailLabel}>ID de Orden:</Text> {successOrder.numero}
                </Text>
                <Text style={styles.successDetailText}>
                  <Text style={styles.successDetailLabel}>Total:</Text> ${formatearPrecio(successOrder.total)}
                </Text>
              </View>
              <TouchableOpacity style={styles.successButton} onPress={handleSuccessAndClose}>
                <Text style={styles.successButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    backgroundColor: UNAB_COLORS.AZUL,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: UNAB_COLORS.BLANCO,
  },
  closeButton: {
    fontSize: 24,
    color: UNAB_COLORS.BLANCO,
    fontWeight: 'bold',
  },
  warningContainer: {
    backgroundColor: UNAB_COLORS.AMARILLO,
    padding: SPACING.MD,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  warningText: {
    color: UNAB_COLORS.GRIS_OSCURO,
  },
  errorContainer: {
    backgroundColor: UNAB_COLORS.ROJO_CLARO,
    padding: SPACING.MD,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: UNAB_COLORS.ROJO_OSCURO,
    flex: 1,
  },
  errorClose: {
    color: UNAB_COLORS.ROJO_OSCURO,
    fontSize: 20,
  },
  section: {
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: UNAB_COLORS.GRIS_CLARO,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.MD,
    borderBottomWidth: 2,
    borderBottomColor: UNAB_COLORS.ROJO,
    paddingBottom: SPACING.SM,
  },
  input: {
    borderWidth: 1,
    borderColor: UNAB_COLORS.GRIS,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    fontSize: 16,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  envioOption: {
    borderWidth: 2,
    borderColor: UNAB_COLORS.GRIS_CLARO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  envioOptionSelected: {
    borderColor: UNAB_COLORS.AZUL,
    backgroundColor: UNAB_COLORS.AZUL_CLARO,
  },
  envioOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  envioOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
  },
  envioOptionDesc: {
    fontSize: 12,
    color: UNAB_COLORS.GRIS,
  },
  envioOptionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
  },
  resumenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: UNAB_COLORS.GRIS_CLARO,
  },
  resumenItemName: {
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
  },
  resumenItemCantidad: {
    fontSize: 12,
    color: UNAB_COLORS.GRIS,
  },
  resumenItemPrice: {
    fontWeight: '600',
    color: UNAB_COLORS.ROJO,
  },
  resumenTotal: {
    borderTopWidth: 2,
    borderTopColor: UNAB_COLORS.AZUL,
    paddingTop: SPACING.MD,
    marginTop: SPACING.SM,
  },
  resumenTotalText: {
    fontSize: 20,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
  },
  confirmButton: {
    backgroundColor: UNAB_COLORS.ROJO,
    padding: SPACING.LG,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 18,
    fontWeight: '600',
  },
  successBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.XL,
    minWidth: 300,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.SM,
  },
  successText: {
    fontSize: 16,
    color: UNAB_COLORS.GRIS,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  successDetails: {
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.LG,
    width: '100%',
  },
  successDetailText: {
    fontSize: 14,
    marginBottom: SPACING.SM,
  },
  successDetailLabel: {
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: UNAB_COLORS.ROJO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    minWidth: 200,
    alignItems: 'center',
  },
  successButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 16,
    fontWeight: '600',
  },
});

