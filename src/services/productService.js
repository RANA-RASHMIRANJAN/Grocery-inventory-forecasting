const API_BASE_URL = 'http://localhost:8080/api';

const readErrorMessage = async (response) => {
  const body = await response.text();
  if (body) {
    try {
      const error = JSON.parse(body);
      return error.message || error.detail || error.title || error.error || body;
    } catch {
      return body;
    }
  }
  return `Request failed (${response.status} ${response.statusText}).`;
};

const request = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the Spring Boot API. Check that it is running at http://localhost:8080.');
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) return null;
  return response.json();
};

const productDetails = (product) => ({
  sku: String(product.sku || '').trim(),
  name: String(product.name || '').trim(),
  category: String(product.category || '').trim(),
  price: Number(product.price),
  unit: String(product.unit || '').trim(),
  supplier: String(product.supplier || '').trim(),
  description: String(product.description || '').trim(),
});

const normalizeProduct = (product) => ({
  ...product,
  id: Number(product.id),
  sku: product.sku || '',
  name: product.name || '',
  category: product.category || '',
  price: Number(product.price),
  unit: product.unit || '',
  supplier: product.supplier || '',
  description: product.description || '',
  quantity: Number(product.quantity),
  minStock: Number(product.minStock),
});

export const getProducts = async () => {
  const products = await request('/products');
  return products.map(normalizeProduct);
};

export const createProduct = async (product) => {
  const created = await request('/products', {
    method: 'POST',
    body: JSON.stringify({
      ...productDetails(product),
      quantity: Number(product.quantity),
      minStock: Number(product.minStock),
    }),
  });
  return normalizeProduct(created);
};

export const updateProduct = async (id, updates) => {
  const updated = await request(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(productDetails(updates)),
  });
  return normalizeProduct(updated);
};

export const deleteProduct = (id) => request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
