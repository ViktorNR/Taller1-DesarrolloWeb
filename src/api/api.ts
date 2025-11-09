import axios from 'axios';
import type { Product } from '../context/StoreContext';

const REMOTE_BASE = 'https://dummyjson.com';
const remoteClient = axios.create({ baseURL: REMOTE_BASE });

async function loadLocalList(): Promise<Product[]> {
  const res = await axios.get('/data/productos.json');
  return res.data as Product[];
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
  return filtered.length ? filtered : local;
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
