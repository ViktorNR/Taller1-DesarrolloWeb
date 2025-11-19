import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFilters } from '../context/FiltersContext';
import { UNAB_COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

export default function Filtros() {
  const [categorias, setCategorias] = useState<string[]>([]);
  const { filtros, actualizarFiltros, limpiarFiltros } = useFilters();

  useEffect(() => {
    // En producción, cargar desde API o assets
    // Por ahora, usar categorías hardcodeadas
    setCategorias([
      'Electrónica',
      'Ropa',
      'Hogar',
      'Deportes',
      'Libros',
      'Juguetes',
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtros.categoria ?? ''}
              onValueChange={(value) => actualizarFiltros({ categoria: value || undefined })}
              style={styles.picker}
              dropdownIconColor={UNAB_COLORS.AZUL}
            >
              <Picker.Item label="Todas las categorías" value="" />
              {categorias.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtros.precio ?? ''}
              onValueChange={(value) => actualizarFiltros({ precio: value || undefined })}
              style={styles.picker}
            >
              <Picker.Item label="Rango de precio" value="" />
              <Picker.Item label="$0 - $10.000" value="0-10000" />
              <Picker.Item label="$10.000 - $25.000" value="10000-25000" />
              <Picker.Item label="$25.000 - $50.000" value="25000-50000" />
              <Picker.Item label="$50.000 - $100.000" value="50000-100000" />
              <Picker.Item label="$100.000 o más" value="100000+" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtros.rating ?? ''}
              onValueChange={(value) => actualizarFiltros({ rating: value || undefined })}
              style={styles.picker}
            >
              <Picker.Item label="Rating mínimo" value="" />
              <Picker.Item label="4+ estrellas" value="4" />
              <Picker.Item label="3+ estrellas" value="3" />
              <Picker.Item label="2+ estrellas" value="2" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtros.orden ?? ''}
              onValueChange={(value) => actualizarFiltros({ orden: value || undefined })}
              style={styles.picker}
            >
              <Picker.Item label="Ordenar por" value="" />
              <Picker.Item label="Precio: menor a mayor" value="precio-asc" />
              <Picker.Item label="Precio: mayor a menor" value="precio-desc" />
              <Picker.Item label="Mejor rating" value="rating-desc" />
              <Picker.Item label="Nombre A-Z" value="nombre-asc" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.limpiarButton} onPress={limpiarFiltros}>
            <Text style={styles.limpiarButtonText}>🗑️ Limpiar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UNAB_COLORS.AZUL,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.MD,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  pickerContainer: {
    backgroundColor: UNAB_COLORS.BLANCO,
    borderRadius: BORDER_RADIUS.SMALL,
    minWidth: 150,
    marginRight: SPACING.SM,
  },
  picker: {
    height: 50,
    width: '100%',
    color: Platform.OS === 'ios' ? UNAB_COLORS.AZUL : UNAB_COLORS.GRIS_OSCURO,
  },
  limpiarButton: {
    backgroundColor: UNAB_COLORS.ROJO_OSCURO,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limpiarButtonText: {
    color: UNAB_COLORS.BLANCO,
    fontWeight: '500',
  },
});

