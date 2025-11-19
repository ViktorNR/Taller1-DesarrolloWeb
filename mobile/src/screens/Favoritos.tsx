import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

export default function Favoritos() {
  const { favorites, removeFromFavorites, addToCart } = useStore();
  const { showToast } = useUI();

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.imagenes?.[0] }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.body}>
              <Text style={styles.title} numberOfLines={2}>
                {item.nombre}
              </Text>
              <Text style={styles.precio}>
                ${(item.precio ?? 0).toLocaleString()}
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.agregarButton}
                  onPress={() => {
                    addToCart(item, 1);
                    showToast('Producto agregado al carrito', 'success');
                  }}
                >
                  <Text style={styles.agregarButtonText}>🛒 Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.eliminarButton}
                  onPress={() => {
                    removeFromFavorites(item.id);
                    showToast('Eliminado de favoritos', 'info');
                  }}
                >
                  <Text style={styles.eliminarButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
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
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    margin: SPACING.XS,
    overflow: 'hidden',
    maxWidth: '48%',
  },
  image: {
    width: '100%',
    height: 150,
  },
  body: {
    padding: SPACING.SM,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.XS,
    minHeight: 36,
  },
  precio: {
    fontSize: 18,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
    marginBottom: SPACING.SM,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.XS,
  },
  agregarButton: {
    flex: 1,
    backgroundColor: UNAB_COLORS.GRIS,
    padding: SPACING.XS,
    borderRadius: BORDER_RADIUS.SMALL,
    alignItems: 'center',
  },
  agregarButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 12,
    fontWeight: '500',
  },
  eliminarButton: {
    backgroundColor: UNAB_COLORS.ROJO,
    padding: SPACING.XS,
    borderRadius: BORDER_RADIUS.SMALL,
    width: 40,
    alignItems: 'center',
  },
  eliminarButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 16,
  },
});

