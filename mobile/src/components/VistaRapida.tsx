import React, { useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import type { Product } from '../context/StoreContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

interface VistaRapidaProps {
  producto?: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function VistaRapida({ producto, open, onClose }: VistaRapidaProps) {
  const [imagenActual, setImagenActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, addToFavorites } = useStore();
  const { showToast } = useUI();

  if (!open || !producto) return null;

  const inc = () => setCantidad(c => Math.min((producto.stock ?? 1), c + 1));
  const dec = () => setCantidad(c => Math.max(1, c - 1));

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop} onTouchEnd={onClose}>
        <ScrollView
          contentContainerStyle={styles.container}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.imageSection}>
              <Image
                source={{ uri: producto.imagenes?.[imagenActual] }}
                style={styles.mainImage}
                resizeMode="contain"
              />
              {producto.imagenes && producto.imagenes.length > 1 && (
                <ScrollView horizontal style={styles.thumbnails}>
                  {(producto.imagenes ?? []).map((img, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.thumbnail, i === imagenActual && styles.thumbnailActive]}
                      onPress={() => setImagenActual(i)}
                    >
                      <Image source={{ uri: img }} style={styles.thumbnailImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.nombre}>{producto.nombre}</Text>
              <Text style={styles.precio}>${(producto.precio ?? 0).toLocaleString()}</Text>
              <Text style={styles.stock}>
                📦 {(producto.stock ?? 0) > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
              </Text>
              <Text style={styles.descripcion}>{producto.descripcion}</Text>

              <View style={styles.cantidadContainer}>
                <Text style={styles.cantidadLabel}>Cantidad</Text>
                <View style={styles.cantidadControls}>
                  <TouchableOpacity
                    style={styles.cantidadButton}
                    onPress={dec}
                    disabled={cantidad <= 1}
                  >
                    <Text style={styles.cantidadButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.cantidadInput}
                    value={String(cantidad)}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.cantidadButton}
                    onPress={inc}
                    disabled={cantidad >= (producto.stock ?? 1)}
                  >
                    <Text style={styles.cantidadButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.agregarButton]}
                  onPress={() => {
                    addToCart(producto, cantidad);
                    showToast('Producto agregado al carrito', 'success');
                    onClose();
                  }}
                  disabled={(producto.stock ?? 0) === 0}
                >
                  <Text style={styles.actionButtonText}>🛒 Agregar al Carrito</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.favoritoButton]}
                  onPress={() => {
                    addToFavorites(producto);
                    showToast('Producto agregado a favoritos', 'success');
                  }}
                >
                  <Text style={styles.actionButtonText}>❤️ Favorito</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: UNAB_COLORS.BLANCO,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.LARGE,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    zIndex: 1,
    backgroundColor: UNAB_COLORS.GRIS,
    borderRadius: BORDER_RADIUS.ROUND,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: SPACING.MD,
  },
  imageSection: {
    marginBottom: SPACING.MD,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  thumbnails: {
    marginTop: SPACING.SM,
  },
  thumbnail: {
    marginRight: SPACING.SM,
    borderWidth: 2,
    borderColor: UNAB_COLORS.GRIS_CLARO,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  thumbnailActive: {
    borderColor: UNAB_COLORS.AZUL,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  infoSection: {
    padding: SPACING.SM,
  },
  nombre: {
    fontSize: 24,
    fontWeight: '700',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.SM,
  },
  precio: {
    fontSize: 28,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
    marginBottom: SPACING.SM,
  },
  stock: {
    fontSize: 14,
    color: UNAB_COLORS.GRIS,
    marginBottom: SPACING.MD,
  },
  descripcion: {
    fontSize: 16,
    color: UNAB_COLORS.GRIS_OSCURO,
    marginBottom: SPACING.MD,
    lineHeight: 24,
  },
  cantidadContainer: {
    marginBottom: SPACING.MD,
  },
  cantidadLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.SM,
  },
  cantidadControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  cantidadButton: {
    backgroundColor: UNAB_COLORS.AZUL,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.ROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cantidadButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 20,
    fontWeight: '600',
  },
  cantidadInput: {
    borderWidth: 2,
    borderColor: UNAB_COLORS.AZUL,
    borderRadius: BORDER_RADIUS.SMALL,
    width: 80,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    gap: SPACING.SM,
  },
  actionButton: {
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  agregarButton: {
    backgroundColor: UNAB_COLORS.AZUL,
  },
  favoritoButton: {
    backgroundColor: UNAB_COLORS.ROJO,
  },
  actionButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 16,
    fontWeight: '600',
  },
});

