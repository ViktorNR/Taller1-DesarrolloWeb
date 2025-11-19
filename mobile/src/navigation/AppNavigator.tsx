import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { UNAB_COLORS } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

// Screens
import Catalogo from '../screens/Catalogo';
import DetalleProducto from '../screens/DetalleProducto';
import Carrito from '../screens/Carrito';
import Favoritos from '../screens/Favoritos';
import Checkout from '../screens/Checkout';
import Auth from '../screens/Auth';
import MisDatos from '../screens/MisDatos';
import MisCompras from '../screens/MisCompras';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: UNAB_COLORS.ROJO,
        tabBarInactiveTintColor: UNAB_COLORS.GRIS,
        tabBarStyle: {
          backgroundColor: UNAB_COLORS.BLANCO,
          borderTopColor: UNAB_COLORS.GRIS_CLARO,
        },
        headerStyle: {
          backgroundColor: UNAB_COLORS.AZUL,
        },
        headerTintColor: UNAB_COLORS.BLANCO,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="CatalogoTab"
        component={Catalogo}
        options={{
          title: 'Catálogo',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="FavoritosTab"
        component={Favoritos}
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>❤️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CarritoTab"
        component={Carrito}
        options={{
          title: 'Carrito',
          tabBarLabel: 'Carrito',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🛒</Text>
          ),
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Simple Perfil Screen that shows user menu
function PerfilScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F5F5F5' }}>
      {user ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#002B5C', marginBottom: 20 }}>
            {user.username}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12 }}
            onPress={() => navigation.navigate('MisDatos')}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#002B5C' }}>Mis Datos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12 }}
            onPress={() => navigation.navigate('MisCompras')}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#002B5C' }}>Mis Compras</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#C8102E', padding: 16, borderRadius: 12, marginTop: 20 }}
            onPress={() => {
              logout();
              navigation.navigate('Main');
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' }}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={{ backgroundColor: '#002B5C', padding: 16, borderRadius: 12 }}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' }}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Main Stack Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: UNAB_COLORS.AZUL,
          },
          headerTintColor: UNAB_COLORS.BLANCO,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalleProducto"
          component={DetalleProducto}
          options={{ title: 'Detalle del Producto' }}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{ 
            title: 'Checkout',
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ title: 'Autenticación' }}
        />
        <Stack.Screen
          name="MisDatos"
          component={MisDatos}
          options={{ title: 'Mis Datos' }}
        />
        <Stack.Screen
          name="MisCompras"
          component={MisCompras}
          options={{ title: 'Mis Compras' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
