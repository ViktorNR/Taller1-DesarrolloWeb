import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getProductById } from '../api/api';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

export default function DetalleProducto() {
  const route = useRoute();
  const params = route.params as { id?: number };
  const id = params?.id;
  const [producto, setProducto] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();
  const { showToast } = useUI();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getProductById(id)
      .then(res => setProducto(res))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={UNAB_COLORS.AZUL} />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: producto.imagenes?.[0] }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.precio}>${(producto.precio ?? 0).toLocaleString()}</Text>
        <Text style={styles.descripcion}>{producto.descripcion}</Text>
        <View style={styles.stockContainer}>
          <Text style={styles.stock}>
            📦 {(producto.stock ?? 0) > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.agregarButton,
            (producto.stock ?? 0) === 0 && styles.agregarButtonDisabled
          ]}
          onPress={() => {
            addToCart(producto, 1);
            showToast('Producto agregado al carrito', 'success');
          }}
          disabled={(producto.stock ?? 0) === 0}
        >
          <Text style={styles.agregarButtonText}>
            🛒 {(producto.stock ?? 0) === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: UNAB_COLORS.GRIS,
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
  },
  content: {
    padding: SPACING.MD,
  },
  nombre: {
    fontSize: 24,
    fontWeight: '700',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.SM,
  },
  precio: {
    fontSize: 32,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
    marginBottom: SPACING.MD,
  },
  descripcion: {
    fontSize: 16,
    color: UNAB_COLORS.GRIS_OSCURO,
    lineHeight: 24,
    marginBottom: SPACING.MD,
  },
  stockContainer: {
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.MD,
  },
  stock: {
    fontSize: 16,
    color: UNAB_COLORS.GRIS,
  },
  agregarButton: {
    backgroundColor: UNAB_COLORS.AZUL,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  agregarButtonDisabled: {
    opacity: 0.6,
  },
  agregarButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 18,
    fontWeight: '600',
  },
});

