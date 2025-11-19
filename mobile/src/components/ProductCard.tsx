import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Product } from '../context/StoreContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../styles/theme';

interface ProductCardProps {
  producto: Product;
  onOpenVista: (p: Product) => void;
}

function Stars({ rating }: { rating?: number }) {
  const r = Math.round((rating ?? 0) * 2) / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (r >= i) {
      stars.push(<Text key={i} style={styles.star}>★</Text>);
    } else if (r + 0.5 === i) {
      stars.push(<Text key={i} style={styles.star}>☆</Text>);
    } else {
      stars.push(<Text key={i} style={[styles.star, { opacity: 0.3 }]}>★</Text>);
    }
  }
  return <View style={styles.starsContainer}>{stars}</View>;
}

export default function ProductCard({ producto, onOpenVista }: ProductCardProps) {
  const navigation = useNavigation();
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useStore();
  const { showToast } = useUI();
  const favorito = favorites.some(f => f.id === producto.id);

  const handleToggleFavorito = () => {
    if (favorito) {
      removeFromFavorites(producto.id);
      showToast('Quitado de favoritos', 'info');
    } else {
      addToFavorites(producto);
      showToast('Agregado a favoritos', 'info');
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DetalleProducto' as never, { id: producto.id } as never)}
      >
        <Image
          source={{ uri: producto.imagenes?.[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.body}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DetalleProducto' as never, { id: producto.id } as never)}
        >
          <Text style={styles.title} numberOfLines={2}>
            {producto.nombre}
          </Text>
        </TouchableOpacity>
        <Text style={styles.precio}>
          ${(producto.precio ?? 0).toLocaleString()}
        </Text>

        <View style={styles.ratingContainer}>
          <Stars rating={producto.rating} />
          <Text style={styles.ratingText}>
            ({(producto.rating ?? 0).toFixed(2)})
          </Text>
        </View>

        <Text style={styles.stock}>
          📦 {(producto.stock ?? 0) > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.vistaRapidaButton]}
            onPress={() => onOpenVista(producto)}
          >
            <Text style={styles.vistaRapidaText}>👁️ Vista Rápida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.favoritoButton, favorito && styles.favoritoActivo]}
            onPress={handleToggleFavorito}
          >
            <Text style={[styles.favoritoText, favorito && styles.favoritoActivoText]}>
              ❤️
            </Text>
          </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    overflow: 'hidden',
    marginBottom: SPACING.MD,
    ...SHADOWS.MEDIUM,
    borderWidth: 1,
    borderColor: UNAB_COLORS.GRIS_CLARO,
  },
  image: {
    width: '100%',
    height: 220,
  },
  body: {
    padding: SPACING.MD,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.SM,
    minHeight: 40,
  },
  precio: {
    fontSize: 20,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
    marginBottom: SPACING.SM,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: SPACING.SM,
  },
  star: {
    fontSize: 16,
    color: UNAB_COLORS.AMARILLO,
  },
  ratingText: {
    fontSize: 12,
    color: UNAB_COLORS.GRIS,
  },
  stock: {
    fontSize: 12,
    color: UNAB_COLORS.GRIS,
    marginBottom: SPACING.MD,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  button: {
    flex: 1,
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vistaRapidaButton: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderWidth: 2,
    borderColor: UNAB_COLORS.AZUL,
  },
  vistaRapidaText: {
    color: UNAB_COLORS.AZUL,
    fontWeight: '500',
  },
  favoritoButton: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderWidth: 2,
    borderColor: UNAB_COLORS.ROJO_OSCURO,
  },
  favoritoActivo: {
    backgroundColor: UNAB_COLORS.ROJO_OSCURO,
  },
  favoritoText: {
    fontSize: 18,
  },
  favoritoActivoText: {
    color: UNAB_COLORS.BLANCO,
  },
  agregarButton: {
    backgroundColor: UNAB_COLORS.GRIS,
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
  },
  agregarButtonDisabled: {
    opacity: 0.6,
  },
  agregarButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontWeight: '500',
  },
});

