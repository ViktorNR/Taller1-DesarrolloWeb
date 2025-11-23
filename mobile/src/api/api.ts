import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from '../context/StoreContext';

const REMOTE_BASE = 'https://dummyjson.com';
const remoteClient = axios.create({ baseURL: REMOTE_BASE });

const BACKEND_BASE = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:8000';
const backendClient = axios.create({ baseURL: BACKEND_BASE });

async function loadLocalList(): Promise<Product[]> {
  // En React Native, necesitamos cargar desde assets o desde el backend
  // Por ahora, retornamos array vacío y confiamos en la API remota
  try {
    // Intentar cargar desde el backend si tiene endpoint
    const res = await backendClient.get('/productos');
    return res.data as Product[];
  } catch (e) {
    // Si falla, retornar array vacío
    return [];
  }
}

function normalizeRemote(p: any): Product {
  return {
    id: p.id,
    nombre: p.title ?? p.nombre ?? String(p.id),
    descripcion: p.description ?? p.descripcion ?? '',
    precio: p.price ?? p.precio ?? 0,
    categoria: p.category ?? p.categoria ?? undefined,
    stock: p.stock ?? p.stock ?? undefined,
    rating: p.rating ?? undefined,
    imagenes: p.images ?? p.imagenes ?? (p.thumbnail ? [p.thumbnail] : [])
  } as Product;
}

export async function getProducts(): Promise<Product[]> {
  const local = await loadLocalList();
  const localIds = new Set(local.map(p => p.id));

  try {
    const res = await remoteClient.get('/products');
    const remoteProductsRaw = (res.data?.products ?? []) as any[];
    const remoteProducts = remoteProductsRaw.map(normalizeRemote);
    const filtered = remoteProducts.filter(p => localIds.has(p.id));
    return local.length ? filtered : remoteProducts;
  } catch (e) {
    return local;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  const local = await loadLocalList();
  const foundLocal = local.find(p => p.id === id);
  if (!foundLocal) return null; 

  try {
    const res = await remoteClient.get(`/products/${id}`);
    const raw = res.data as any;
    return normalizeRemote(raw);
  } catch (e) {
    return foundLocal ?? null;
  }
}

// ==================== AUTH / USER API ====================

export interface RegisterPayload {
  email: string;
  username: string;
  nombre?: string;
  apellido?: string;
  rut?: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await backendClient.post('/register', payload);
  return res.data;
}

export async function loginUser(username: string, password: string) {
  // OAuth2 password flow expects form-urlencoded data at /token
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const res = await backendClient.post('/token', body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return res.data as { access_token: string; token_type: string };
}

export function setAuthToken(token?: string | null) {
  if (token) {
    backendClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete backendClient.defaults.headers.common['Authorization'];
  }
}

export async function getCurrentUser() {
  const res = await backendClient.get('/users/me');
  return res.data;
}

export interface UpdateUserPayload {
  nombre?: string;
  apellido?: string;
  rut?: string;
  email?: string;
  telefono?: string;
}

export async function updateCurrentUser(payload: UpdateUserPayload) {
  const body: any = { ...payload };
  if (body.rut && typeof body.rut === 'string') {
    body.rut = body.rut.replace(/[^0-9kK]/g, '').toUpperCase();
  }
  const res = await backendClient.put('/usuarios/me', body);
  return res.data;
}

// ==================== DOCUMENTOS / ORDENES API ====================

export interface DocumentoResponse {
  id: string;
  usuario_id: string;
  estado: string;
  monto_total: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface DocumentoCreate {
  estado?: string;
}

export interface DetalleDocumentoResponse {
  id: string;
  documento_id: string;
  producto: string;
  precio: number;
  cantidad: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface DetalleDocumentoCreate {
  producto: string;
  precio: number;
  cantidad: number;
}

export async function createDocumento(payload: any = { estado: 'completado' }): Promise<DocumentoResponse> {
  const token = await AsyncStorage.getItem('access_token');

  const res = await backendClient.post(
    '/documentos',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

export async function createDetalleDocumento(
  documentoId: string,
  producto: string,
  precio: number,
  cantidad: number
): Promise<DetalleDocumentoResponse> {
  const res = await backendClient.post(`/documentos/${documentoId}/detalles`, {
    producto,
    precio,
    cantidad
  });
  return res.data;
}

export async function getDocumentos(): Promise<DocumentoResponse[]> {
  const res = await backendClient.get('/documentos');
  return res.data;
}

export async function getDetalleDocumento(documentoId: string): Promise<DetalleDocumentoResponse[]> {
  const res = await backendClient.get(`/documentos/${documentoId}/detalles`);
  return res.data;
}

