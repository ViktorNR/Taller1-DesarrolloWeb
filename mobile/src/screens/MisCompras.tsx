import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { getDocumentos, getDetalleDocumento, getProducts } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

type Documento = any;

export default function MisCompras() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState<Documento[]>([]);
  const [detallesMap, setDetallesMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDocumentos(), getProducts()])
      .then(([docs, prods]) => {
        setOrdenes(docs ?? []);
        setProductos(prods ?? []);
      })
      .catch(() => {
        setOrdenes([]);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function verDetalles(id: string) {
    if (detallesMap[id]) {
      setExpandedOrder(expandedOrder === id ? null : id);
      return;
    }
    try {
      const det = await getDetalleDocumento(id);
      setDetallesMap(m => ({ ...m, [id]: det }));
      setExpandedOrder(id);
    } catch (e) {
      setDetallesMap(m => ({ ...m, [id]: [] }));
    }
  }

  function findProductByName(name: string) {
    if (!name) return null;
    const normalize = (s: string) => s
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
    const target = normalize(name);
    return (
      productos.find(p => normalize(p.nombre ?? '') === target) ||
      productos.find(p => normalize(p.nombre ?? '').includes(target)) ||
      productos.find(p => target.includes(normalize(p.nombre ?? ''))) ||
      null
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={UNAB_COLORS.AZUL} />
        <Text style={styles.loadingText}>Cargando órdenes...</Text>
      </View>
    );
  }

  if (ordenes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>No tienes órdenes registradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ordenes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderTitle}>
                  Orden {String(item.id).substring(0, 8).toUpperCase()}
                </Text>
                <Text style={styles.orderMeta}>
                  Estado: {item.estado} • {item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleString() : ''}
                </Text>
                <Text style={styles.orderTotal}>
                  Total: ${item.monto_total?.toLocaleString?.() ?? item.monto_total}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => verDetalles(item.id)}
              >
                <Text style={styles.detailsButtonText}>
                  {expandedOrder === item.id ? 'Ocultar' : 'Ver'} detalles
                </Text>
              </TouchableOpacity>
            </View>

            {expandedOrder === item.id && detallesMap[item.id] && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Detalles</Text>
                <View style={styles.userInfo}>
                  <Text style={styles.userInfoText}>
                    <Text style={styles.userInfoLabel}>Usuario:</Text> {user?.nombre ?? user?.username}{user?.apellido ? ` ${user.apellido}` : ''}
                  </Text>
                  <Text style={styles.userInfoText}>
                    <Text style={styles.userInfoLabel}>Email:</Text> {user?.email}
                  </Text>
                  {user?.rut && (
                    <Text style={styles.userInfoText}>
                      <Text style={styles.userInfoLabel}>RUT:</Text> {user.rut}
                    </Text>
                  )}
                </View>

                {item.direccion && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dirección de envío:</Text>
                    <Text style={styles.sectionText}>
                      {item.direccion.direccion ?? item.direccion.address ?? JSON.stringify(item.direccion)}
                    </Text>
                    <Text style={styles.sectionText}>
                      Código postal: {item.direccion.codigoPostal ?? item.direccion.postal ?? ''}
                    </Text>
                    <Text style={styles.sectionText}>
                      {item.direccion.comuna ?? ''} • {item.direccion.ciudad ?? ''}
                    </Text>
                  </View>
                )}

                {item.envio && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Envío:</Text>
                    <Text style={styles.sectionText}>
                      {item.envio.nombre ?? JSON.stringify(item.envio)}
                    </Text>
                  </View>
                )}

                {item.cupon && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cupón:</Text>
                    <Text style={styles.sectionText}>
                      {item.cupon.codigo ?? JSON.stringify(item.cupon)} — {item.cupon.monto ?? item.cupon.descuento ?? ''}
                    </Text>
                  </View>
                )}

                <View style={styles.itemsContainer}>
                  {detallesMap[item.id].map((d: any) => {
                    const prod = findProductByName(d.producto ?? d.nombre ?? '');
                    return (
                      <View key={d.id ?? d.producto} style={styles.itemCard}>
                        {prod?.imagenes?.[0] ? (
                          <Image
                            source={{ uri: prod.imagenes[0] }}
                            style={styles.itemImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.itemImagePlaceholder} />
                        )}
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{d.producto}</Text>
                          <Text style={styles.itemMeta}>
                            Cantidad: {d.cantidad} • Precio unitario: ${d.precio}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  loadingText: {
    marginTop: SPACING.MD,
    color: UNAB_COLORS.GRIS,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  emptyText: {
    fontSize: 18,
    color: UNAB_COLORS.GRIS,
  },
  listContent: {
    padding: SPACING.MD,
  },
  orderCard: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.XS,
  },
  orderMeta: {
    fontSize: 12,
    color: UNAB_COLORS.GRIS,
    marginBottom: SPACING.XS,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: UNAB_COLORS.ROJO,
  },
  detailsButton: {
    backgroundColor: UNAB_COLORS.AZUL,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  detailsButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    marginTop: SPACING.MD,
    paddingTop: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: UNAB_COLORS.GRIS_CLARO,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.MD,
  },
  userInfo: {
    marginBottom: SPACING.MD,
  },
  userInfoText: {
    fontSize: 14,
    color: UNAB_COLORS.GRIS_OSCURO,
    marginBottom: SPACING.XS,
  },
  userInfoLabel: {
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.XS,
  },
  sectionText: {
    fontSize: 14,
    color: UNAB_COLORS.GRIS_OSCURO,
  },
  itemsContainer: {
    marginTop: SPACING.MD,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
    gap: SPACING.MD,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: UNAB_COLORS.GRIS_CLARO,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: UNAB_COLORS.AZUL,
    marginBottom: SPACING.XS,
  },
  itemMeta: {
    fontSize: 12,
    color: UNAB_COLORS.GRIS,
  },
});

