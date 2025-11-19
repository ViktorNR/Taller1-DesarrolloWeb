import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, Modal } from 'react-native';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import Checkout from './Checkout';

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, emptyCart } = useStore();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const changeQuantity = (itemId: number, change: number) => {
    updateQuantity(itemId, change);
  };

  const confirmEmptyCart = () => {
    emptyCart();
    setShowModal(false);
  };

  const handleCheckout = () => {
    if (user) {
      setShowCheckout(true);
    } else {
      navigation.navigate('Auth' as never);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.imagen }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.nombre}</Text>
              <Text style={styles.itemPrice}>${formatPrice(item.precio)}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.cantidad}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemActions}>
              <Text style={styles.itemTotal}>
                ${formatPrice(item.precio * item.cantidad)}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${formatPrice(getTotalPrice())}</Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={[styles.button, styles.vaciarButton]}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.buttonText}>Vaciar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.checkoutButton]}
            onPress={handleCheckout}
          >
            <Text style={styles.buttonText}>Proceder al pago</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Vaciar carrito?</Text>
            <Text style={styles.modalText}>Esta acción no puede deshacerse</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmEmptyCart}
              >
                <Text style={[styles.modalButtonText, { color: UNAB_COLORS.BLANCO }]}>Sí, vaciar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showCheckout && (
        <Checkout onClose={() => setShowCheckout(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
  },
  listContent: {
    padding: SPACING.MD,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    ...UNAB_COLORS,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.MD,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.XS,
  },
  itemPrice: {
    fontSize: 14,
    color: UNAB_COLORS.ROJO,
    fontWeight: '600',
    marginBottom: SPACING.SM,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  quantityButton: {
    backgroundColor: UNAB_COLORS.AZUL,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.ROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
    marginBottom: SPACING.SM,
  },
  removeButton: {
    padding: SPACING.XS,
  },
  removeButtonText: {
    fontSize: 20,
  },
  footer: {
    backgroundColor: UNAB_COLORS.BLANCO,
    padding: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: UNAB_COLORS.GRIS_CLARO,
  },
  totalText: {
    fontSize: 24,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  button: {
    flex: 1,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  vaciarButton: {
    backgroundColor: UNAB_COLORS.GRIS,
  },
  checkoutButton: {
    backgroundColor: UNAB_COLORS.ROJO,
  },
  buttonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.LG,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.SM,
  },
  modalText: {
    fontSize: 16,
    color: UNAB_COLORS.GRIS,
    marginBottom: SPACING.LG,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
  },
  modalButtonConfirm: {
    backgroundColor: UNAB_COLORS.ROJO,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
  },
});

