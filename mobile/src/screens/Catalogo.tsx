import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { getProducts } from '../api/api';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import Filtros from '../components/Filtros';
import { useFilters } from '../context/FiltersContext';
import ProductCard from '../components/ProductCard';
import VistaRapida from '../components/VistaRapida';
import type { Product } from '../context/StoreContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

export default function Catalogo() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const { filtros, actualizarFiltros } = useFilters();
  const [vistaProduct, setVistaProduct] = useState<Product | null>(null);
  const [vistaOpen, setVistaOpen] = useState(false);
  const { showToast } = useUI();

  const loadProducts = async () => {
    try {
      const p = await getProducts();
      setProductos(p);
      setFiltered(p);
    } catch (err) {
      console.error('[Catalogo] error loading products', err);
      setProductos([]);
      setFiltered([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let list = [...productos];
    if (filtros.categoria) list = list.filter(p => p.categoria === filtros.categoria);
    if (filtros.rating) list = list.filter(p => (p.rating ?? 0) >= Number(filtros.rating));
    if (filtros.precio) {
      const v = filtros.precio;
      if (v.endsWith('+')) {
        list = list.filter(p => p.precio >= Number(v.replace('+', '').replace(/[^0-9]/g, '')));
      } else {
        const [min, max] = v.split('-').map((s: string) => Number(s.replace(/[^0-9]/g, '')));
        list = list.filter(p => p.precio >= min && p.precio <= max);
      }
    }
    if (filtros.orden) {
      if (filtros.orden === 'precio-asc') list.sort((a, b) => a.precio - b.precio);
      if (filtros.orden === 'precio-desc') list.sort((a, b) => b.precio - a.precio);
      if (filtros.orden === 'rating-desc') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      if (filtros.orden === 'nombre-asc') list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    if (filtros.busqueda) {
      const q = (filtros.busqueda || '').toLowerCase();
      list = list.filter(p => (p.nombre || '').toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [filtros, productos]);

  const onOpenVista = (p: Product) => {
    setVistaProduct(p);
    setVistaOpen(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  if (loading && productos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={UNAB_COLORS.AZUL} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  const displayList = (filtered && filtered.length > 0) ? filtered : productos;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={filtros.busqueda ?? ''}
          onChangeText={(text) => actualizarFiltros({ busqueda: text })}
        />
      </View>
      <Filtros />
      {displayList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No se encontraron productos</Text>
          <Text style={styles.emptyText}>Intenta ajustar los filtros de búsqueda</Text>
        </View>
      ) : (
        <FlatList
          data={displayList}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <ProductCard producto={item} onOpenVista={onOpenVista} />
            </View>
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <VistaRapida producto={vistaProduct} open={vistaOpen} onClose={() => setVistaOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
  },
  searchContainer: {
    padding: SPACING.SM,
    backgroundColor: UNAB_COLORS.BLANCO,
    borderBottomWidth: 1,
    borderBottomColor: UNAB_COLORS.GRIS_CLARO,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: UNAB_COLORS.GRIS_CLARO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    fontSize: 16,
    backgroundColor: UNAB_COLORS.BLANCO,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.MD,
    color: UNAB_COLORS.GRIS,
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
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: 16,
    color: UNAB_COLORS.GRIS,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: SPACING.MD,
  },
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    margin: SPACING.XS,
    maxWidth: '48%',
  },
});

