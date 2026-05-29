// Lista de productos (30 items) con precio - valores por defecto
const DEFAULT_PRODUCTOS = [
    { nombre: "Coca-Cola 600 ml", cat: "Bebidas", img: "coca600.png", price: 20 },
    { nombre: "Coca-Cola 2L", cat: "Bebidas", img: "coca2l.png", price: 35 },
    { nombre: "Pepsi 600 ml", cat: "Bebidas", img: "pepsi600.png", price: 19 },
    { nombre: "Leche Alpura 1L", cat: "Abarrotes", img: "alpura.png", price: 24 },
    { nombre: "Pan Blanco Bimbo", cat: "Abarrotes", img: "bimbo.png", price: 28 },
    { nombre: "Tortillas", cat: "Abarrotes", img: "tortillas.png", price: 22 },
    { nombre: "Sabritas Original", cat: "Snacks", img: "sabritas.png", price: 18 },
    { nombre: "Pringles Original", cat: "Snacks", img: "pringles.png", price: 40 },
    { nombre: "Galletas Oreo", cat: "Snacks", img: "oreo.png", price: 26 },
    { nombre: "Galletas Marías", cat: "Snacks", img: "marias.png", price: 15 },
    { nombre: "Agua Bonafont 500 ml", cat: "Bebidas", img: "bonafont.png", price: 12 },
    { nombre: "Agua Ciel 600 ml", cat: "Bebidas", img: "ciel.png", price: 11 },
    { nombre: "Jumex Mango 330 ml", cat: "Bebidas", img: "mango.png", price: 14 },
    { nombre: "Jumex Durazno 330 ml", cat: "Bebidas", img: "durazno.png", price: 14 },
    { nombre: "Atún Dolores", cat: "Abarrotes", img: "atun.png", price: 38 },
    { nombre: "Frijoles Isadora", cat: "Abarrotes", img: "frijoles.png", price: 30 },
    { nombre: "Arroz Verde Valle", cat: "Abarrotes", img: "arroz.png", price: 36 },
    { nombre: "Azúcar Zulka", cat: "Abarrotes", img: "azucar.png", price: 25 },
    { nombre: "Café Nescafé", cat: "Abarrotes", img: "cafe.png", price: 60 },
    { nombre: "Papel Higiénico", cat: "Higiene", img: "papel.png", price: 45 },
    { nombre: "Shampoo Sedal", cat: "Higiene", img: "shampoo.png", price: 50 },
    { nombre: "Jabón Zote", cat: "Higiene", img: "zote.png", price: 12 },
    { nombre: "Pasta Colgate", cat: "Higiene", img: "colgate.png", price: 28 },
    { nombre: "Chicles Trident", cat: "Snacks", img: "trident.png", price: 8 },
    { nombre: "Carlos V", cat: "Snacks", img: "carlosv.png", price: 10 },
    { nombre: "Gansito", cat: "Snacks", img: "gansito.png", price: 16 },
    { nombre: "Huevos", cat: "Abarrotes", img: "huevos.png", price: 40 },
    { nombre: "Aceite Capullo", cat: "Abarrotes", img: "aceite.png", price: 55 },
    { nombre: "Salsa Valentina", cat: "Abarrotes", img: "valentina.png", price: 20 },
    { nombre: "Cuadernos", cat: "Abarrotes", img: "cuadernos.png", price: 22 }
];

const PRODUCTS_KEY = 'lupita_products_v1';

function loadProducts() {
    try {
        const raw = localStorage.getItem(PRODUCTS_KEY);
        if (raw) {
            let arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                const deduped = dedupeProducts(arr).map(p => {
                    if (p && !p.img) {
                        const def = DEFAULT_PRODUCTOS.find(d => d.nombre === p.nombre);
                        if (def && def.img) p.img = def.img;
                    }
                    return p;
                });
                if (deduped.length !== arr.length) {
                    saveProducts(deduped);
                }
                return deduped;
            }
        }
    } catch (e) { console.error('Error loading products', e); }
    // fallback: initialize defaults with stock = 18
    const seeded = DEFAULT_PRODUCTOS.map(p => ({ ...p, stock: 18 }));
    saveProducts(seeded);
    return seeded;
}

function saveProducts(products) {
    try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }
    catch (e) { console.error('Error saving products', e); }
}

function dedupeProducts(products) {
    if (!Array.isArray(products)) return [];
    const seen = new Set();
    return products.filter(p => {
        if (!p || (!p.id && !p.nombre)) return false;
        const key = String(p.id || p.nombre).trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function isIndexCatalogPage() {
    const path = window.location.pathname.toLowerCase();
    const page = path.split('/').pop();
    return page === '' || page === 'index.html' || page === 'index';
}

function getAssetPath(relativePath) {
    const currentPath = window.location.pathname;
    const folder = currentPath.substring(0, currentPath.lastIndexOf('/'));
    if (folder && folder !== '/') {
        return `../${relativePath}`;
    }
    return relativePath;
}

let currentProductEditKey = null;

function openEditProductModal(productKey) {
    const product = loadProducts().find(p => (p.id && String(p.id) === String(productKey)) || p.nombre === productKey);
    if (!product) return;
    currentProductEditKey = productKey;
    const modal = document.getElementById('edit-product-modal');
    if (!modal) return;
    modal.querySelector('[name="edit-nombre"]').value = product.nombre || '';
    modal.querySelector('[name="edit-categoria"]').value = product.cat || '';
    modal.querySelector('[name="edit-precio"]').value = (product.price != null ? product.price : 0).toString();
    modal.querySelector('[name="edit-stock"]').value = (product.stock != null ? product.stock : 0).toString();
    modal.classList.add('open');
}

function closeEditProductModal() {
    const modal = document.getElementById('edit-product-modal');
    if (!modal) return;
    modal.classList.remove('open');
    currentProductEditKey = null;
}

function saveEditedProductModal() {
    if (!currentProductEditKey) return;
    const modal = document.getElementById('edit-product-modal');
    if (!modal) return;
    const nombre = modal.querySelector('[name="edit-nombre"]').value.trim();
    const categoria = modal.querySelector('[name="edit-categoria"]').value.trim();
    const precio = parseFloat(modal.querySelector('[name="edit-precio"]').value);
    const stock = parseInt(modal.querySelector('[name="edit-stock"]').value, 10);
    if (!nombre || isNaN(precio) || isNaN(stock)) {
        alert('Completa los campos de edición con valores válidos.');
        return;
    }
    const products = loadProducts();
    const product = products.find(p => (p.id && String(p.id) === String(currentProductEditKey)) || p.nombre === currentProductEditKey);
    if (!product) {
        alert('No se encontró el producto a editar.');
        closeEditProductModal();
        return;
    }
    product.nombre = nombre;
    product.cat = categoria;
    product.price = precio;
    product.stock = stock;
    saveProducts(products);
    closeEditProductModal();
    renderProductos();
}

async function loadProductsFromFirestore() {
    if (!FIRESTORE_ENABLED) return [];
    try {
        const snapshot = await db.collection('productos').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error('Error cargando productos desde Firestore', e);
        return [];
    }
}

async function saveProductsToFirestore(products) {
    if (!FIRESTORE_ENABLED) return;
    try {
        const batch = db.batch();
        products.forEach(product => {
            let ref;
            if (product.id) {
                ref = db.collection('productos').doc(product.id);
            } else {
                ref = db.collection('productos').doc();
                product.id = ref.id;
            }
            batch.set(ref, {
                nombre: product.nombre,
                cat: product.cat,
                img: product.img,
                price: product.price,
                stock: product.stock
            });
        });
        await batch.commit();
    } catch (e) {
        console.error('Error guardando productos en Firestore', e);
    }
}

async function loadOrdersFromFirestore() {
    if (!FIRESTORE_ENABLED) return [];
    try {
        const snapshot = await db.collection('pedidos').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            // normalize status/estado values to capitalized form
            let rawStatus = data.status || data.estado || 'Pendiente';
            rawStatus = String(rawStatus || '').trim();
            const normalizedStatus = rawStatus.length ? (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()) : 'Pendiente';
            return {
                id: doc.id,
                ...data,
                status: normalizedStatus,
                createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
                createdAtReadable: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toLocaleString() : data.createdAtReadable || new Date().toLocaleString()
            };
        });
    } catch (e) {
        console.error('Error cargando pedidos desde Firestore', e);
        return [];
    }
}

async function saveOrderToFirestore(order) {
    if (!FIRESTORE_ENABLED) return;
    try {
        await db.collection('pedidos').doc(order.id).set({
            cliente: order.cliente,
            items: order.items,
            paymentMethod: order.paymentMethod,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            status: order.status,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date(order.createdAt)),
            createdAtReadable: order.createdAtReadable
        });
    } catch (e) {
        console.error('Error guardando pedido en Firestore', e);
    }
}

async function updateProductStockInFirestore(nombre, stock) {
    if (!FIRESTORE_ENABLED) return;
    try {
        const snapshot = await db.collection('productos').where('nombre', '==', nombre).limit(1).get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await doc.ref.update({ stock });
        }
    } catch (e) {
        console.error('Error actualizando stock en Firestore', e);
    }
}

async function initFirestoreData() {
    if (!FIRESTORE_ENABLED) return;
    const firestoreProducts = await loadProductsFromFirestore();
    if (firestoreProducts.length > 0) {
        const normalized = firestoreProducts.map(p => ({
            nombre: p.nombre,
            cat: p.cat,
            img: p.img,
            price: p.price,
            stock: p.stock != null ? p.stock : 18,
            id: p.id
        }));
        saveProducts(normalized);
    } else {
        const seeded = DEFAULT_PRODUCTOS.map(p => ({ ...p, stock: 18 }));
        saveProducts(seeded);
        await saveProductsToFirestore(seeded);
    }
    const firestoreOrders = await loadOrdersFromFirestore();
    if (firestoreOrders.length > 0) {
        saveOrders(firestoreOrders);
    }
}

let paginaActual = 1;
const productosPorPagina = 10;
let categoriaFiltrada = "Todas";

function renderProductos() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const editable = isIndexCatalogPage();
    grid.innerHTML = '';

    let allProducts = loadProducts();
    if (!allProducts || !Array.isArray(allProducts) || allProducts.length === 0) {
        // fallback to defaults if localStorage is empty or corrupted
        allProducts = DEFAULT_PRODUCTOS.map(p => ({ ...p, stock: 18 }));
        // do not overwrite localStorage automatically to avoid surprising writes
    }
    // ensure every product has an image (fallback to DEFAULT_PRODUCTOS mapping or placeholder)
    allProducts = allProducts.map(p => {
        if (!p.img || typeof p.img !== 'string' || p.img.trim() === '') {
            const def = DEFAULT_PRODUCTOS.find(d => d.nombre === p.nombre);
            p.img = def && def.img ? def.img : 'placeholder.png';
        }
        return p;
    });
    // Remove duplicate products before filtering to avoid repeated items in catalog
    const dedupedProducts = dedupeProducts(allProducts);
    if (dedupedProducts.length !== allProducts.length) {
        saveProducts(dedupedProducts);
    }
    allProducts = dedupedProducts;

    // Filtrar por categoría
    const filtrados = allProducts.filter(p => categoriaFiltrada === "Todas" || p.cat === categoriaFiltrada);

    // Calcular paginación
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const paginados = filtrados.slice(inicio, fin);

    paginados.forEach((p, idx) => {
        const imgSrc = getAssetPath(`img/${p.img || 'placeholder.png'}`);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="size-label" style="font-size:0.9rem">${p.nombre}</div>
            <div class="img-placeholder">
                <img src="${imgSrc}" alt="${p.nombre}" onerror="this.src='${getAssetPath('img/placeholder.png')}'">
            </div>
            <div style="padding:0 12px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <div>
                    <strong class="product-price">$${(typeof p.price === 'number' ? p.price : parseFloat(p.price || 0)).toFixed(2)}</strong>
                    ${editable ? `<div style="font-size:0.8rem;color:#666">Stock: <span class="stock-count">${p.stock}</span></div>` : ''}
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
                    <button class="select-btn">Agregar</button>
                    ${editable ? `<button class="edit-product-btn btn-action" data-key="${p.id || p.nombre}" style="background:#0066cc;color:#fff;border:none;padding:8px 10px;border-radius:8px;">Editar</button>` : ''}
                </div>
            </div>
        `;
        // Attach add-to-cart handler capturing product
        const btn = card.querySelector('.select-btn');
        btn.addEventListener('click', () => addToCart(p));
        // disable button if no stock
        if (!p.stock || p.stock <= 0) btn.disabled = true;

        const editBtn = card.querySelector('.edit-product-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => openEditProductModal(editBtn.dataset.key));
        }

        grid.appendChild(card);
    });

    // Actualizar info de página
    const totalPaginas = Math.ceil(filtrados.length / productosPorPagina);
    const pageInfoEl = document.getElementById('page-info');
    if (pageInfoEl) pageInfoEl.innerText = `Página ${paginaActual} de ${totalPaginas || 1}`;
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if (btnPrev) btnPrev.disabled = paginaActual === 1;
    if (btnNext) btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

/* ------------------ Carrito ------------------ */
// Usar window.cart como fuente única de verdad para el carrito
window.cart = window.cart || [];

function addToCart(product) {
    const products = loadProducts();
    const p = products.find(x => x.nombre === product.nombre);
    if (!p || !p.stock || p.stock <= 0) {
        alert('No hay suficiente inventario para agregar este producto.');
        return;
    }

    const found = window.cart.find(i => i.nombre === product.nombre);
    if (found) {
        found.qty += 1;
    } else {
        window.cart.push({ nombre: product.nombre, price: product.price, img: product.img, qty: 1 });
    }

    p.stock = Math.max(0, p.stock - 1);
    saveProducts(products);

    renderCart();
    if (document.getElementById('products-grid')) renderProductos();
    upsertCurrentCartFromMemory();
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;
    list.innerHTML = '';

    if (!window.cart || window.cart.length === 0) {
        list.innerHTML = '<p>El carrito está vacío.</p>';
    }

    (window.cart || []).forEach((item, idx) => {
        const imgSrc = getAssetPath(`img/${item.img || 'placeholder.png'}`);
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${imgSrc}" alt="${item.nombre}" onerror="this.src='${getAssetPath('img/placeholder.png')}'">
            <div class="item-details">
                <span>${item.nombre}</span>
                <small>Precio: $${item.price.toFixed(2)}</small>
            </div>
            <select class="qty-select">
                ${[1,2,3,4,5,6,7,8,9,10].map(q => `<option value="${q}" ${q===item.qty? 'selected':''}>${q}</option>`).join('')}
            </select>
            <span class="item-price">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="delete-btn" data-idx="${idx}">Eliminar</button>
        `;
        list.appendChild(div);
    });

    // quantity change handlers
    document.querySelectorAll('.qty-select').forEach((sel, i) => {
        sel.addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10);
            const cartItem = window.cart[i];
            if (!cartItem) return;
            const currentQty = cartItem.qty;
            const delta = val - currentQty;
            if (delta === 0) return;

            const products = loadProducts();
            const prod = products.find(p => p.nombre === cartItem.nombre);
            if (delta > 0) {
                if (!prod || prod.stock < delta) {
                    alert('Cantidad solicitada excede el inventario disponible.');
                    sel.value = currentQty;
                    return;
                }
                prod.stock = Math.max(0, prod.stock - delta);
            } else if (prod) {
                prod.stock = Math.max(0, prod.stock - delta);
            }

            cartItem.qty = val;
            saveProducts(products);
            renderCart();
            if (document.getElementById('products-grid')) renderProductos();
            upsertCurrentCartFromMemory();
        });
    });

    // delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            if (!isNaN(idx)) {
                const item = window.cart[idx];
                if (item) {
                    const products = loadProducts();
                    const prod = products.find(p => p.nombre === item.nombre);
                    if (prod) {
                        prod.stock = Math.max(0, prod.stock + item.qty);
                        saveProducts(products);
                    }
                }
                window.cart.splice(idx, 1);
                renderCart();
                if (document.getElementById('products-grid')) renderProductos();
                upsertCurrentCartFromMemory();
            }
        });
    });

    updateTotals();
}

function updateTotals() {
    const subtotal = (window.cart || []).reduce((s, it) => s + it.price * it.qty, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    const f = v => `$${v.toFixed(2)}`;
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total-final');
    if (subtotalEl) subtotalEl.innerText = f(subtotal);
    if (taxEl) taxEl.innerText = f(tax);
    if (totalEl) totalEl.innerText = f(total);
    // actualizar contador de carrito en footer
    const totalItems = (window.cart || []).reduce((s, it) => s + it.qty, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = totalItems;
}


function filterCategory(cat) {
    categoriaFiltrada = cat;
    paginaActual = 1;
    const nameEl = document.getElementById('current-category-name');
    if (nameEl) nameEl.innerText = cat;
    
    // Actualizar estilo botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat);
    });

    renderProductos();
}

function nextPage() { paginaActual++; renderProductos(); }
function prevPage() { paginaActual--; renderProductos(); }

// Nav button active state (header)
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const current = document.querySelector('.nav-btn.active');
        if (current) current.classList.remove('active');
        this.classList.add('active');
    });
});

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    if (FIRESTORE_ENABLED) await initFirestoreData();
    renderProductos();
});

// Función para cambiar de vistas (catálogo <-> pedidos)
function switchTab(viewName) {
    // Ocultamos todas las secciones relevantes
    document.querySelectorAll('.main-content, .content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostramos la sección solicitada
    if(viewName === 'pedidos') {
        const pedidosEl = document.getElementById('section-pedidos');
        if (pedidosEl) pedidosEl.style.display = 'block';
        const catalogEl = document.getElementById('catalog-view');
        if (catalogEl) catalogEl.style.display = 'none';
    } else {
        const catalogEl = document.getElementById('catalog-view');
        if (catalogEl) catalogEl.style.display = 'block';
        const pedidosEl = document.getElementById('section-pedidos');
        if (pedidosEl) pedidosEl.style.display = 'none';
    }
}

// Asignar el evento a los botones del menú (Inicio y Pedidos)
const navBtns = document.querySelectorAll('.nav-btn');
if (navBtns && navBtns.length > 1) {
    navBtns[1].addEventListener('click', () => switchTab('pedidos'));
    navBtns[0].addEventListener('click', () => switchTab('inicio'));
}

// Funciones para abrir y cerrar el carrito
function openCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.add('open', 'fullscreen');
        if (typeof renderCart === 'function') renderCart();
        if (typeof updateTotals === 'function') updateTotals();
    }
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('open', 'fullscreen');
    }
}

// Asegúrate de que el botón "Ver Carrito" del footer tenga el onclick
document.addEventListener('DOMContentLoaded', () => {
    const footerBtn = document.getElementById('footer-cart-btn') || document.querySelector('.footer-btn');
    if (footerBtn) footerBtn.setAttribute('onclick', 'openCart()');
});

function confirmPurchase() {
    const terminos = document.getElementById('terms-checkbox');
    if(!terminos || !terminos.checked) {
        alert("Por favor acepte los términos para continuar.");
        return;
    }

    // Validar dirección de envío
    const direccion = document.getElementById('direccion');
    const ciudad = document.getElementById('ciudad');
    const postal = document.getElementById('codigo-postal');
    const estado = document.getElementById('estado-codigo');
    const telefono = document.getElementById('telefono');

    if (!direccion || !direccion.value.trim() || !ciudad || !ciudad.value.trim() || !postal || !postal.value.trim() || !estado || !estado.value.trim() || !telefono || !telefono.value.trim()) {
        alert('Por favor complete todos los datos de dirección antes de confirmar el pedido.');
        return;
    }

    // Validar método de pago seleccionado
    const pmEl = document.querySelector('input[name="pay"]:checked');
    if (!pmEl) {
        alert('Por favor seleccione un método de pago antes de confirmar.');
        return;
    }

    // Crear pedido a partir del carrito
    const order = addOrderFromCart();
    if (order) {
        closeCart();
        showOrderTicket(order);
    } else {
        alert("El carrito está vacío. Agrega productos antes de confirmar.");
    }
}

function showOrderTicket(order) {
    if (!order) return;
    const modal = document.getElementById('order-ticket-modal');
    const body = document.getElementById('order-ticket-body');
    if (!modal || !body) return;

    const itemsHtml = order.items.map(item => `
        <tr>
            <td>${item.nombre}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.qty).toFixed(2)}</td>
        </tr>
    `).join('');

    body.innerHTML = `
        <div style="padding:10px 0;">
            <p><strong>Pedido:</strong> ${order.id}</p>
            <p><strong>Cliente:</strong> ${order.cliente}</p>
            <p><strong>Método de pago:</strong> ${order.paymentMethod}</p>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr>
                    <th style="text-align:left;border-bottom:1px solid #ccc;padding:8px;">Producto</th>
                    <th style="text-align:right;border-bottom:1px solid #ccc;padding:8px;">Cantidad</th>
                    <th style="text-align:right;border-bottom:1px solid #ccc;padding:8px;">Precio</th>
                    <th style="text-align:right;border-bottom:1px solid #ccc;padding:8px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        <div style="margin-top:14px;text-align:right;">
            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p><strong>IVA (16%):</strong> $${order.tax.toFixed(2)}</p>
            <p style="font-size:1.1rem;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
    `;
    // store current order id for report actions
    body.dataset.orderId = order.id;
    modal.classList.add('open');
}

function closeOrderTicket() {
    const modal = document.getElementById('order-ticket-modal');
    if (modal) modal.classList.remove('open');
}

function printOrderTicket() {
    const ticketBody = document.getElementById('order-ticket-body');
    if (!ticketBody) return;
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;
    newWindow.document.write(`<html><head><title>Ticket de Compra</title><style>body{font-family:Arial,sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #ccc;text-align:left;}h2{margin-top:0;}</style></head><body><h2>Ticket de Compra</h2>${ticketBody.innerHTML}</body></html>`);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
}

function generateOrderTicketHTML(order) {
    if (!order) return '<div>Pedido no encontrado</div>';
    const itemsHtml = (order.items || []).map(it => `
        <tr>
            <td>${it.nombre}</td>
            <td style="text-align:right;">${it.qty}</td>
            <td style="text-align:right;">$${it.price.toFixed(2)}</td>
            <td style="text-align:right;">$${(it.price*it.qty).toFixed(2)}</td>
        </tr>`).join('');
    return `
        <div>
            <h2>Ticket de Compra - ${order.id}</h2>
            <p><strong>Cliente:</strong> ${order.cliente || '—'}</p>
            <p><strong>Teléfono:</strong> ${order.telefono || '—'}</p>
            <p><strong>Email:</strong> ${order.email || '—'}</p>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <thead><tr><th style="text-align:left;border-bottom:1px solid #ccc;padding:6px;">Producto</th><th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Cant.</th><th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Precio</th><th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Total</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            <div style="text-align:right;margin-top:12px;">
                <div><strong>Subtotal:</strong> $${(order.subtotal||0).toFixed(2)}</div>
                <div><strong>IVA (16%):</strong> $${(order.tax||0).toFixed(2)}</div>
                <div style="font-size:1.1rem;"><strong>Total:</strong> $${(order.total||0).toFixed(2)}</div>
            </div>
        </div>
    `;
}

function downloadOrderTicket(id) {
    const orders = loadOrders();
    const order = orders.find(o=>o.id===id);
    if (!order) return alert('Pedido no encontrado');
    const html = generateOrderTicketHTML(order);
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;
    newWindow.document.write(`<html><head><title>Ticket ${order.id}</title><style>body{font-family:Arial,sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #ccc;text-align:left;}h2{margin-top:0;}</style></head><body>${html}</body></html>`);
    newWindow.document.close();
    newWindow.focus();
    // allow user to save/print via browser
}

function reportOrder(orderId) {
    const orders = loadOrders();
    const order = orders.find(o=>o.id===orderId);
    if (!order) return alert('Pedido no encontrado');
    const message = prompt('Describe tu reporte o problema (breve):');
    if (!message || !message.trim()) return alert('Reporte cancelado: descripción vacía.');
    const report = {
        orderId: order.id,
        cliente: order.cliente || null,
        telefono: order.telefono || null,
        email: order.email || null,
        message: message.trim()
    };
    const ok = submitClientReport(report);
    if (ok) alert('Reporte enviado. El administrador lo verá en Reportes.');
}

// --- Mis Pedidos for clients ---
function openMyOrdersModal() {
    const modal = document.getElementById('my-orders-modal');
    if (modal) modal.classList.add('open');
}

function findOrdersByContact(contact) {
    if (!contact) return [];
    contact = String(contact).trim().toLowerCase();
    const orders = loadOrders();
    return orders.filter(o => {
        if (!o) return false;
        const tel = (o.telefono || '').toString().toLowerCase();
        const email = (o.email || '').toString().toLowerCase();
        const cliente = (o.cliente || '').toString().toLowerCase();
        return tel === contact || email === contact || cliente.includes(contact) || email.includes(contact) || tel.includes(contact);
    });
}

function searchMyOrders() {
    const input = document.getElementById('my-orders-contact');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return alert('Ingresa teléfono o email para buscar tus pedidos.');
    const found = findOrdersByContact(val);
    renderMyOrders(found);
}

function renderMyOrders(list) {
    const tbody = document.getElementById('my-orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No se encontraron pedidos para ese contacto.</td></tr>'; return;
    }
    list.forEach(o=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.cliente || '—'}</td>
            <td>${o.telefono || o.email || '—'}</td>
            <td><strong>$${(o.total||0).toFixed(2)}</strong></td>
            <td>${o.status}</td>
            <td>
                <button class="btn-action" onclick="showOrderTicketById('${o.id}')">Ver</button>
                <button class="btn-action" onclick="downloadOrderTicket('${o.id}')">Descargar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showOrderTicketById(id) {
    const orders = loadOrders();
    const o = orders.find(x=>x.id===id);
    if (!o) return alert('Pedido no encontrado');
    showOrderTicket(o);
    const body = document.getElementById('order-ticket-body');
    if (body) body.dataset.orderId = id;
}

// Cerrar si hacen clic fuera de la ventana
window.addEventListener('click', function(event) {
    let modal = document.getElementById('cart-modal');
    if (modal && event.target == modal) {
        closeCart();
    }
});

/* ------------------ Pedidos / Persistencia ------------------ */
const ORDERS_KEY = 'lupita_orders_v1';
const CARTS_KEY = 'lupita_carts_v1';
const CURRENT_CART_KEY = 'lupita_current_cart_v1';
const REPORTS_KEY = 'lupita_reports_v1';
const CASH_CUTS_KEY = 'lupita_cash_cuts_v1';

function loadReports() {
    try { const raw = localStorage.getItem(REPORTS_KEY); return raw ? JSON.parse(raw) : []; } catch(e){ console.error('Error loading reports', e); return []; }
}

function saveReports(reports) {
    try { localStorage.setItem(REPORTS_KEY, JSON.stringify(reports)); } catch(e){ console.error('Error saving reports', e); }
}

function loadCashCuts() {
    try { const raw = localStorage.getItem(CASH_CUTS_KEY); return raw ? JSON.parse(raw) : []; } catch(e){ console.error('Error loading cash cuts', e); return []; }
}

function saveCashCuts(cuts) {
    try { localStorage.setItem(CASH_CUTS_KEY, JSON.stringify(cuts)); } catch(e){ console.error('Error saving cash cuts', e); }
}

function createCashCutRecord(dateValue) {
    const orders = loadOrders();
    const selected = new Date(dateValue);
    if (isNaN(selected.getTime())) return null;
    const dayKey = selected.toISOString().slice(0, 10);
    const filteredOrders = orders.filter(o => {
        try { return new Date(o.createdAt).toISOString().slice(0, 10) === dayKey; } catch(e){ return false; }
    });
    const count = filteredOrders.length;
    const total = filteredOrders.reduce((sum,o) => sum + (Number(o.total) || 0), 0);
    const subtotalTotal = filteredOrders.reduce((sum,o) => sum + (Number(o.subtotal) || 0), 0);
    const taxTotal = filteredOrders.reduce((sum,o) => sum + (Number(o.tax) || 0), 0);
    return {
        id: 'CT-' + dayKey.replace(/-/g,'') + '-' + Date.now().toString().slice(-5),
        date: dayKey,
        createdAt: new Date().toISOString(),
        orderCount: count,
        total: total,
        subtotalTotal: subtotalTotal,
        taxTotal: taxTotal,
        orderIds: filteredOrders.map(o => o.id || null).filter(Boolean)
    };
}

function renderCashCuts() {
    const tbody = document.getElementById('cash-cuts-tbody');
    const summaryEl = document.getElementById('cash-cut-summary');
    if (summaryEl) {
        const dateInput = document.getElementById('cash-cut-date');
        const dateValue = dateInput ? dateInput.value : (new Date().toISOString().slice(0, 10));
        const preview = createCashCutRecord(dateValue);
        if (preview) {
            summaryEl.innerHTML = `
                <div class="stat-item"><span>Pedidos en el día</span> <strong>${preview.orderCount}</strong></div>
                <div class="stat-item"><span>Total Ventas ($)</span> <strong>$${preview.total.toFixed(2)}</strong></div>
                <div class="stat-item"><span>Subtotal ($)</span> <strong>$${preview.subtotalTotal.toFixed(2)}</strong></div>
                <div class="stat-item"><span>IVA ($)</span> <strong>$${preview.taxTotal.toFixed(2)}</strong></div>
            `;
        } else {
            summaryEl.innerHTML = '<div style="color:#666;">Selecciona una fecha válida para ver el corte previo.</div>';
        }
    }
    if (!tbody) return;
    const cuts = loadCashCuts();
    tbody.innerHTML = '';
    cuts.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    cuts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.date}</td>
            <td>${c.orderCount}</td>
            <td><strong>$${(c.total || 0).toFixed(2)}</strong></td>
            <td>${new Date(c.createdAt).toLocaleString()}</td>
            <td><button class="btn-table btn-download-cut" data-id="${c.id}">Ver</button></td>
        `;
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-download-cut').forEach(b => b.addEventListener('click', (e) => showCashCutDetails(e.currentTarget.getAttribute('data-id'))));
}

function createCashCut() {
    const dateInput = document.getElementById('cash-cut-date');
    const dateValue = dateInput ? dateInput.value : null;
    if (!dateValue) return alert('Selecciona la fecha del corte.');
    const cut = createCashCutRecord(dateValue);
    if (!cut) return alert('La fecha del corte no es válida.');
    const cuts = loadCashCuts();
    cuts.unshift(cut);
    saveCashCuts(cuts);
    renderCashCuts();
    alert(`Corte de caja guardado para ${cut.date} con ${cut.orderCount} pedidos y $${cut.total.toFixed(2)}.`);
}

function showCashCutDetails(cutId) {
    const cuts = loadCashCuts();
    const cut = cuts.find(x=>x.id===cutId);
    if (!cut) return alert('Corte no encontrado.');
    alert(`Corte de Caja ${cut.id}\nFecha: ${cut.date}\nPedidos: ${cut.orderCount}\nTotal: $${cut.total.toFixed(2)}\nSubtotal: $${cut.subtotalTotal.toFixed(2)}\nIVA: $${cut.taxTotal.toFixed(2)}\nGenerado: ${new Date(cut.createdAt).toLocaleString()}`);
}

function submitClientReport(report) {
    try {
        const reports = loadReports();
        report.id = 'RPT-' + Date.now().toString().slice(-6);
        report.createdAt = new Date().toISOString();
        reports.unshift(report);
        saveReports(reports);
        if (FIRESTORE_ENABLED) {
            try { db.collection('reports').doc(report.id).set(report); } catch(e){ console.warn('Error saving report to firestore', e); }
        }
        // update admin reports view if visible
        if (document.querySelector('.reports-page')) renderReports();
        return true;
    } catch (e) { console.error('submitClientReport', e); return false; }
}

function loadOrders() {
    try {
        const raw = localStorage.getItem(ORDERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Error loading orders', e);
        return [];
    }
}

function loadCarts() {
    try {
        const raw = localStorage.getItem(CARTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { console.error('Error loading carts', e); return []; }
}

function saveCarts(carts) {
    try { localStorage.setItem(CARTS_KEY, JSON.stringify(carts)); }
    catch (e) { console.error('Error saving carts', e); }
}

function loadCurrentCart() {
    try {
        const raw = localStorage.getItem(CURRENT_CART_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { console.error('Error loading current cart', e); return null; }
}

function saveCurrentCart(cartRecord) {
    try {
        localStorage.setItem(CURRENT_CART_KEY, JSON.stringify(cartRecord));
        // also upsert into carts list
        const carts = loadCarts();
        const idx = carts.findIndex(c=>c.id === cartRecord.id);
        if (idx >= 0) carts[idx] = cartRecord; else carts.unshift(cartRecord);
        saveCarts(carts);
    } catch (e) { console.error('Error saving current cart', e); }
}

function createNewCartRecord() {
    const now = new Date();
    return {
        id: 'CART-' + now.getFullYear().toString().slice(-2) + ('0'+(now.getMonth()+1)).slice(-2) + ('0'+now.getDate()).slice(-2) + '-' + now.getTime().toString().slice(-6),
        cliente: null,
        email: null,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        createdAt: now.toISOString(),
        lastUpdated: now.toISOString(),
        estado_carrito: 'activo'
    };
}

function upsertCurrentCartFromMemory() {
    // Build cartRecord from in-memory `window.cart` variable and save
    let cartRecord = loadCurrentCart();
    if (!cartRecord) cartRecord = createNewCartRecord();
    const clienteInput = document.getElementById('cliente-name');
    if (clienteInput && clienteInput.value.trim()) cartRecord.cliente = clienteInput.value.trim();
    const subtotal = (window.cart || []).reduce((s,it)=>s+it.price*it.qty,0);
    const tax = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    cartRecord.items = (window.cart || []).map(i=>({ nombre:i.nombre, price:i.price, qty:i.qty }));
    cartRecord.subtotal = subtotal; cartRecord.tax = tax; cartRecord.total = total;
    cartRecord.lastUpdated = new Date().toISOString();
    cartRecord.estado_carrito = cartRecord.items.length > 0 ? 'activo' : cartRecord.estado_carrito;
    saveCurrentCart(cartRecord);
}

// mark carts abandoned after timeout (2 hours)
function checkAbandonedCarts() {
    try {
        const carts = loadCarts();
        const now = Date.now();
        let changed = false;
        carts.forEach(c => {
            if (c.estado_carrito === 'activo') {
                const last = new Date(c.lastUpdated).getTime();
                if (now - last > 1000 * 60 * 60 * 2) { // 2 hours
                    c.estado_carrito = 'abandonado';
                    c.abandonedAt = new Date().toISOString();
                    changed = true;
                }
            }
        });
        if (changed) saveCarts(carts);
    } catch (e) { console.error('Error checking abandoned carts', e); }
}

// run on load and periodically
setTimeout(checkAbandonedCarts, 2000);
setInterval(checkAbandonedCarts, 1000 * 60 * 15); // every 15 minutes

function saveOrders(orders) {
    try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        if (document.querySelector('.reports-page')) renderReports();
        // update pedidos del día counters if pedidos page visible
        try { updatePedidosDayStats(); } catch (e) { /* ignore */ }
    } catch (e) {
        console.error('Error saving orders', e);
    }
}

function updatePedidosDayStats() {
    // only update when pedidos section exists
    if (!document.getElementById('section-pedidos')) return;
    const pedidosTotalesEl = document.getElementById('pedidos-totales');
    const ventasTotalesEl = document.getElementById('ventas-totales');
    const totalDiaEl = document.getElementById('total-dia');
    if (!pedidosTotalesEl && !ventasTotalesEl && !totalDiaEl) return;

    const orders = loadOrders();
    const today = new Date().toLocaleDateString();
    const todays = orders.filter(o => {
        try { return new Date(o.createdAt).toLocaleDateString() === today; }
        catch (e) { return false; }
    });

    const count = todays.length;
    const ventas = todays.reduce((s,o) => s + (Number(o.total) || 0), 0);
    const subtotalSum = todays.reduce((s,o) => s + (Number(o.subtotal) || 0), 0);

    if (pedidosTotalesEl) pedidosTotalesEl.innerText = count;
    if (ventasTotalesEl) ventasTotalesEl.innerText = `$${ventas.toFixed(2)}`;
    if (totalDiaEl) totalDiaEl.innerText = `$${subtotalSum.toFixed(2)}`;
}

function updateReportsIfVisible() {
    if (document.querySelector('.reports-page')) renderReports();
}

function generateOrderId() {
    const now = new Date();
    return 'PED-' + now.getFullYear().toString().slice(-2) +
        ('0'+(now.getMonth()+1)).slice(-2) + ('0'+now.getDate()).slice(-2) + '-' + now.getTime().toString().slice(-5);
}

function addOrderFromCart() {
    if (!window.cart || window.cart.length === 0) return false;
    const orders = loadOrders();
    const now = new Date();
    const subtotal = window.cart.reduce((s,it)=>s+it.price*it.qty,0);
    const tax = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    // Intentar obtener nombre de cliente desde el modal si existe
    let clienteName = 'Mostrador';
    const clienteInput = document.getElementById('cliente-name');
    if (clienteInput && clienteInput.value.trim().length) clienteName = clienteInput.value.trim();

    const pmEl = document.querySelector('input[name="pay"]:checked');
    const paymentMethod = pmEl ? pmEl.value : 'N/A';

    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('cliente-email');
    const order = {
        id: generateOrderId(),
        cliente: clienteName,
        telefono: telefonoInput && telefonoInput.value ? telefonoInput.value.trim() : (clienteInput && clienteInput.dataset && clienteInput.dataset.telefono ? clienteInput.dataset.telefono : null),
        email: emailInput && emailInput.value ? emailInput.value.trim() : null,
        createdAt: now.toISOString(),
        createdAtReadable: now.toLocaleString(),
        items: window.cart.map(i=>({ nombre:i.nombre, price:i.price, qty:i.qty })),
        paymentMethod,
        subtotal, tax, total,
        status: 'Pendiente'
    };

    // Registrar el cliente en el listado si es uno nuevo
    const clientData = getClientDataFromCheckout();
    addClientFromOrder(clientData, order);

    // mark the current cart as completed
    try {
        const currentCart = loadCurrentCart();
        if (currentCart) {
            currentCart.estado_carrito = 'completado';
            currentCart.completedAt = new Date().toISOString();
            currentCart.orderId = order.id;
            saveCurrentCart(currentCart);
        }
    } catch (e) { console.error('Error marking cart completed', e); }

    orders.unshift(order); // newest first
    saveOrders(orders);

    // limpiar carrito
    window.cart.length = 0;
    renderCart();

    // descontar stock de los productos vendidos
    try {
        const products = loadProducts();
        order.items.forEach(it => {
            const p = products.find(x=>x.nombre === it.nombre);
            if (p) {
                p.stock = Math.max(0, (p.stock || 0) - it.qty);
            }
        });
        saveProducts(products);
        // refrescar catálogo si visible
        if (document.getElementById('products-grid')) renderProductos();
    } catch (e) { console.error('Error updating stock after sale', e); }

    // si estamos en la página de pedidos, refrescar vista
    if (document.getElementById('orders-tbody')) renderOrders(currentOrderFilter || 'Pendientes');
    return true;
}

// Renderizar pedidos en la tabla, agrupando por día
let currentOrderFilter = 'Pendientes';
function updatePedidoTabsCount(orders) {
    const tabs = document.querySelectorAll('.tabs-pedidos .tab');
    if (!tabs || tabs.length === 0) return;
    const pendienteCount = orders.filter(o => o.status === 'Pendiente').length;
    const enviadoCount = orders.filter(o => o.status === 'Enviado').length;
    const canceladoCount = orders.filter(o => o.status === 'Cancelado').length;
    const totalCount = orders.length;

    tabs.forEach(tab => {
        const text = tab.innerText.toLowerCase();
        if (text.includes('pendientes')) tab.innerText = `Pendientes (${pendienteCount})`;
        else if (text.includes('enviados')) tab.innerText = `Enviados (${enviadoCount})`;
        else if (text.includes('cancelados')) tab.innerText = `Cancelados (${canceladoCount})`;
        else if (text.includes('todos')) tab.innerText = `Todos (${totalCount})`;
    });
}

function renderOrders(filter) {
    currentOrderFilter = filter || currentOrderFilter;
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    const orders = loadOrders();
    updatePedidoTabsCount(orders);

    // filtrar
    let filtered = orders.slice();
    if (currentOrderFilter === 'Pendientes') filtered = orders.filter(o=>o.status==='Pendiente');
    else if (currentOrderFilter === 'Enviados') filtered = orders.filter(o=>o.status==='Enviado');
    else if (currentOrderFilter === 'Cancelados') filtered = orders.filter(o=>o.status==='Cancelado');

    // agrupar por fecha (día)
    tbody.innerHTML = '';
    let lastDate = null;
    filtered.forEach(o=>{
        const d = new Date(o.createdAt);
        const day = d.toLocaleDateString();
        if (day !== lastDate) {
            const trDay = document.createElement('tr');
            trDay.className = 'orders-day-row';
            trDay.innerHTML = `<td colspan="8" style="background:#f0f0f0;font-weight:bold;padding:8px;">${day}</td>`;
            tbody.appendChild(trDay);
            lastDate = day;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.cliente}</td>
            <td>${o.createdAtReadable}</td>
            <td>${o.paymentMethod || '—'}</td>
            <td>${o.items.reduce((s,it)=>s+it.qty,0)}</td>
            <td><strong>$${o.total.toFixed(2)}</strong></td>
            <td class="status-${o.status.toLowerCase()}">${o.status}</td>
            <td>
                <div class="table-btns">
                    <button class="btn-table btn-view" data-id="${o.id}"><i class="fas fa-eye"></i>Ver</button>
                    <button class="btn-table btn-send" data-id="${o.id}"><i class="fas fa-truck"></i>Enviar</button>
                        <button class="btn-table btn-download" data-id="${o.id}"><i class="fas fa-file-download"></i>Descargar</button>
                        <button class="btn-table btn-cancel" data-id="${o.id}"><i class="fas fa-ban"></i>Cancelar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // attach handlers
    tbody.querySelectorAll('.btn-send').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); updateOrderStatus(id,'Enviado');
    }));
    tbody.querySelectorAll('.btn-download').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); downloadOrderTicket(id);
    }));
    tbody.querySelectorAll('.btn-cancel').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); updateOrderStatus(id,'Cancelado');
    }));
    tbody.querySelectorAll('.btn-view').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); viewOrderDetail(id);
    }));
}

/* ------------------ Carritos (Reportes) ------------------ */
function renderCarts(filterState='abandonado'){
    const tbody = document.getElementById('carts-tbody');
    if (!tbody) return;
    const carts = loadCarts();
    const filtered = carts.filter(c => !filterState || c.estado_carrito === filterState);
    // sort by lastUpdated desc
    filtered.sort((a,b)=> new Date(b.lastUpdated) - new Date(a.lastUpdated));
    tbody.innerHTML = '';
    filtered.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.cliente || c.email || '—'}</td>
            <td><strong>$${(c.total || 0).toFixed(2)}</strong></td>
            <td>${new Date(c.lastUpdated).toLocaleString()}</td>
            <td>${c.estado_carrito}</td>
            <td>
                <button class="btn-table btn-recover" data-id="${c.id}"><i class="fas fa-reply"></i> Recuperar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-recover').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); recoverCart(id);
    }));
}

function generateCoupon() {
    const rnd = Math.random().toString(36).slice(2,8).toUpperCase();
    return `LUP5-${rnd}`;
}

function recoverCart(cartId) {
    const carts = loadCarts();
    const c = carts.find(x=>x.id===cartId);
    if (!c) return alert('Carrito no encontrado');
    // generate coupon valid 24h
    const coupon = generateCoupon();
    c.coupon = coupon;
    c.couponExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
    c.reminderSentAt = new Date().toISOString();
    saveCarts(carts);

    const name = c.cliente || 'cliente';
    const to = c.email || '';
    const msg = `Hola ${name}, notamos que dejaste algunos productos en tu carrito de Abarrotes LUPITA. Usa el cupón ${coupon} para obtener 5% de descuento válido por 24 horas. ¿Tuviste algún problema con tu pago?`;

    // prefer email if email exists else open WhatsApp
    if (to) {
        const subject = encodeURIComponent('¿Te ayudamos con tu carrito en LUPITA?');
        const body = encodeURIComponent(msg);
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    } else {
        const wa = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(wa, '_blank');
    }
}

// render carts page if present
document.addEventListener('DOMContentLoaded', ()=>{
    if (document.getElementById('carts-tbody')) renderCarts('abandonado');
});

document.addEventListener('DOMContentLoaded', ()=>{
    const myBtn = document.getElementById('open-my-orders-btn');
    if (myBtn) myBtn.addEventListener('click', openMyOrdersModal);
});

/* ------------------ Reportes ------------------ */
function computeKPIs() {
    const orders = loadOrders();
    const carts = loadCarts();
    const now = new Date();
    // ventas mes
    const month = now.getMonth(); const year = now.getFullYear();
    const ventasMes = orders.filter(o => new Date(o.createdAt).getMonth() === month && new Date(o.createdAt).getFullYear() === year)
        .reduce((s,o)=>s+ (o.total || 0), 0);
    // carritos abandonados
    const abandoned = carts.filter(c=>c.estado_carrito === 'abandonado');
    const abandonedValue = abandoned.reduce((s,c)=> s + (c.total || 0), 0);
    // producto estrella (by units sold)
    const productCounts = {};
    orders.forEach(o=> o.items.forEach(it=>{ productCounts[it.nombre] = (productCounts[it.nombre]||0) + (it.qty||0); }));
    const best = Object.keys(productCounts).sort((a,b)=> productCounts[b]-productCounts[a])[0] || null;
    const bestUnits = best ? productCounts[best] : 0;
    return { ventasMes, abandonedCount: abandoned.length, abandonedValue, best, bestUnits };
}

function addOrderFromCart(paymentMethodOverride) {
    if (!window.cart || window.cart.length === 0) return false;
    const orders = loadOrders();
    const now = new Date();
    const subtotal = window.cart.reduce((s,it)=>s+it.price*it.qty,0);
    const tax = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    // Intentar obtener nombre de cliente desde el modal si existe
    let clienteName = 'Mostrador';
    const clienteInput = document.getElementById('cliente-name');
    if (clienteInput && clienteInput.value.trim().length) clienteName = clienteInput.value.trim();

    let paymentMethod = paymentMethodOverride;
    if (!paymentMethod) {
        const pmEl = document.querySelector('input[name="pay"]:checked');
        paymentMethod = pmEl ? pmEl.value : 'N/A';
    }

    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('cliente-email');
    const order = {
        id: generateOrderId(),
        cliente: clienteName,
        telefono: telefonoInput && telefonoInput.value ? telefonoInput.value.trim() : null,
        email: emailInput && emailInput.value ? emailInput.value.trim() : null,
        createdAt: now.toISOString(),
        createdAtReadable: now.toLocaleString(),
        items: window.cart.map(i=>({ nombre:i.nombre, price:i.price, qty:i.qty })),
        paymentMethod,
        subtotal, tax, total,
        status: 'Pendiente'
    };

    orders.unshift(order); // newest first
    saveOrders(orders);
    if (FIRESTORE_ENABLED) saveOrderToFirestore(order);

    // limpiar carrito
    window.cart.length = 0;
    renderCart();

    // descontar stock de los productos vendidos
    try {
        const products = loadProducts();
        order.items.forEach(it => {
            const p = products.find(x=>x.nombre === it.nombre);
            if (p) {
                p.stock = Math.max(0, (p.stock || 0) - it.qty);
            }
        });
        saveProducts(products);
        if (FIRESTORE_ENABLED) {
            products.forEach(p => updateProductStockInFirestore(p.nombre, p.stock));
        }
        // refrescar catálogo si visible
        if (document.getElementById('products-grid')) renderProductos();
    } catch (e) { console.error('Error updating stock after sale', e); }

    // si estamos en la página de pedidos, refrescar vista
    if (document.getElementById('orders-tbody')) renderOrders(currentOrderFilter || 'Pendientes');

    // mark the current cart as completed if present
    try {
        const currentCart = loadCurrentCart();
        if (currentCart) {
            currentCart.estado_carrito = 'completado';
            currentCart.completedAt = new Date().toISOString();
            currentCart.orderId = order.id;
            saveCurrentCart(currentCart);
        }
    } catch (e) { console.error('Error marking cart completed', e); }

    return order;
}

/* ------------------ Admin UI Helpers ------------------ */
function checkAdminSessionUI() {
    try {
        const exp = Number(localStorage.getItem('adminExpiresAt') || 0);
        const logged = localStorage.getItem('adminLoggedIn') === '1' && exp && Date.now() < exp;
        const adminBtn = document.getElementById('admin-toggle-btn');
        const adminLogout = document.getElementById('admin-logout-btn');
        const adminLogin = document.getElementById('admin-login-btn');
        const adminPanel = document.getElementById('admin-seed-panel');
        if (adminBtn) adminBtn.style.display = logged ? 'inline-block' : 'none';
        if (adminLogout) adminLogout.style.display = logged ? 'inline-block' : 'none';
        if (adminLogin) adminLogin.style.display = logged ? 'none' : 'inline-block';
        if (adminPanel) {
            if (logged) adminPanel.style.display = 'block';
            else {
                const params = new URLSearchParams(location.search);
                adminPanel.style.display = params.get('admin') === '1' ? 'block' : 'none';
            }
        }
    } catch (e) { console.warn('checkAdminSessionUI', e); }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAdminSessionUI();
    setInterval(checkAdminSessionUI, 5000);
    const adminBtn = document.getElementById('admin-toggle-btn');
    if (adminBtn) adminBtn.addEventListener('click', () => {
        const p = document.getElementById('admin-seed-panel');
        if (p) p.style.display = (p.style.display === 'block' ? 'none' : 'block');
    });
    const adminLogout = document.getElementById('admin-logout-btn');
    if (adminLogout) adminLogout.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminExpiresAt');
        const p = document.getElementById('admin-seed-panel'); if (p) p.style.display = 'none';
        checkAdminSessionUI();
    });
});

function renderReports() {
    const kpi = computeKPIs();

    const ventasMesEl = document.getElementById('reports-ventas-mes');
    if (ventasMesEl) ventasMesEl.innerText = `$${kpi.ventasMes.toFixed(2)}`;

    const abandonedCountEl = document.getElementById('reports-abandoned-count');
    if (abandonedCountEl) abandonedCountEl.innerText = kpi.abandonedCount;

    const abandonedValueEl = document.getElementById('reports-abandoned-value');
    if (abandonedValueEl) abandonedValueEl.innerText = `$${kpi.abandonedValue.toFixed(2)}`;

    const bestProductEl = document.getElementById('reports-best-product');
    if (bestProductEl) {
        bestProductEl.innerHTML = `
            <p class="amount">${kpi.best || '—'}</p>
            <span class="trend">${kpi.bestUnits} unidades vendidas</span>
        `;
    }

    const abTbody = document.getElementById('report-abandoned-tbody');
    if (abTbody) {
        const carts = loadCarts().filter(c => c.estado_carrito === 'abandonado');
        abTbody.innerHTML = '';
        carts.slice(0, 6).forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.cliente || c.email || c.id}</td>
                <td><strong>$${(c.total || 0).toFixed(2)}</strong></td>
                <td>${new Date(c.lastUpdated).toLocaleString()}</td>
                <td><button class="btn-recover" data-id="${c.id}">Recuperar</button></td>
            `;
            abTbody.appendChild(tr);
        });
        abTbody.querySelectorAll('.btn-recover').forEach(b => b.addEventListener('click', (e) => recoverCart(e.currentTarget.getAttribute('data-id'))));
    }

    const chartEl = document.getElementById('weekly-sales-chart');
    if (chartEl) {
        const counts = [0, 0, 0, 0, 0, 0, 0];
        loadOrders().forEach(o => {
            const d = new Date(o.createdAt);
            counts[d.getDay()] += o.total || 0;
        });
        const labels = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
        chartEl.innerHTML = '';
        const max = Math.max(...counts, 1);
        labels.forEach((lab, i) => {
            const h = Math.round((counts[i] / max) * 100);
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = h + '%';
            bar.style.position = 'relative';
            const span = document.createElement('span');
            span.innerText = lab;
            span.style.position = 'absolute';
            span.style.bottom = '-22px';
            span.style.left = '50%';
            span.style.transform = 'translateX(-50%)';
            span.style.fontSize = '0.75rem';
            span.style.color = '#666';
            bar.appendChild(span);
            chartEl.appendChild(bar);
        });
    }

    const topTbody = document.getElementById('top-products-tbody');
    if (topTbody) {
        const counts = {};
        loadOrders().forEach(o => o.items.forEach(it => {
            counts[it.nombre] = counts[it.nombre] || { units: 0, revenue: 0 };
            counts[it.nombre].units += it.qty;
            counts[it.nombre].revenue += (it.qty * it.price);
        }));
        const rows = Object.keys(counts).map(k => ({ name: k, units: counts[k].units, revenue: counts[k].revenue })).sort((a, b) => b.units - a.units).slice(0, 10);
        topTbody.innerHTML = '';
        rows.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.name}</td><td>${r.units}</td><td>$${r.revenue.toFixed(2)}</td>`;
            topTbody.appendChild(tr);
        });
    }
    // render client-submitted reports table
    renderClientReports();
    renderCashCuts();
}

function renderClientReports() {
    const tbody = document.getElementById('client-reports-tbody');
    if (!tbody) return;
    const reports = loadReports();
    tbody.innerHTML = '';
    reports.forEach(r => {
        const responseText = r.response ? (r.response.message || '').replace(/\n/g,' ') : '—';
        const responseBy = r.response ? `<div style="font-size:0.8rem;color:#555;margin-top:4px;">(${r.response.responder || 'Admin'})</div>` : '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.orderId || '—'}</td>
            <td>${r.cliente || '—'}</td>
            <td>${r.telefono || r.email || '—'}</td>
            <td>${(r.message || '').replace(/\n/g,' ')}</td>
            <td>${responseText}${responseBy}</td>
            <td>${new Date(r.createdAt).toLocaleString()}</td>
            <td><button class="btn-table btn-respond-report" data-id="${r.id}">Responder</button></td>
        `;
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-respond-report').forEach(b => b.addEventListener('click', e => openReportResponseModal(e.currentTarget.getAttribute('data-id'))));
}

function openReportResponseModal(reportId) {
    const report = loadReports().find(r=>r.id===reportId);
    if (!report) return alert('Reporte no encontrado.');
    const modal = document.getElementById('report-response-modal');
    if (!modal) return;
    document.getElementById('response-report-id').value = report.id;
    document.getElementById('response-order-id').value = report.orderId || '';
    document.getElementById('response-client-name').value = report.cliente || '';
    document.getElementById('response-client-contact').value = report.telefono || report.email || '';
    document.getElementById('response-original-message').value = report.message || '';
    document.getElementById('response-admin-message').value = report.response ? report.response.message || '' : '';
    modal.dataset.reportId = reportId;
    modal.classList.add('open');
}

function closeReportResponseModal() {
    const modal = document.getElementById('report-response-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.dataset.reportId = '';
}

function prefillReportResponseTemplate() {
    const textarea = document.getElementById('response-admin-message');
    if (!textarea) return;
    textarea.value = 'Gracias por su observación, trabajaremos en eso.';
}

function submitReportResponse() {
    const modal = document.getElementById('report-response-modal');
    if (!modal) return;
    const reportId = modal.dataset.reportId;
    const message = document.getElementById('response-admin-message').value.trim();
    if (!reportId) return alert('Reporte no seleccionado.');
    if (!message) return alert('Escribe la respuesta antes de guardar.');
    const reports = loadReports();
    const report = reports.find(r=>r.id===reportId);
    if (!report) return alert('Reporte no encontrado.');
    const adminName = localStorage.getItem('adminName') || 'Administrador';
    report.response = {
        message,
        responder: adminName,
        respondedAt: new Date().toISOString()
    };
    saveReports(reports);
    if (FIRESTORE_ENABLED) {
        try { db.collection('reports').doc(report.id).set(report); } catch (e) { console.warn('Error guardando respuesta en Firestore', e); }
    }
    closeReportResponseModal();
    renderReports();
}

document.addEventListener('DOMContentLoaded', ()=>{
    if (document.querySelector('.reports-page')) {
        const periodSelect = document.getElementById('reports-period-select');
        const dateInput = document.getElementById('cash-cut-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().slice(0, 10);
            dateInput.addEventListener('change', () => renderCashCuts());
        }
        if (periodSelect) {
            periodSelect.addEventListener('change', ()=> renderReports());
        }
        renderReports();
    }
});

async function updateOrderStatus(id, status) {
    const orders = loadOrders();
    const o = orders.find(x=>x.id===id);
    if (!o) return;
    // Normalize status values to capitalized form to avoid casing mismatches
    const normalized = String(status || '').trim();
    const normStatus = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    o.status = normStatus;
    if (normStatus === 'Enviado') {
        o.sentAt = new Date().toISOString();
    }
    if (normStatus === 'Cancelado') {
        o.canceledAt = new Date().toISOString();
    }
    saveOrders(orders);
    // persist change to Firestore when enabled
    if (typeof FIRESTORE_ENABLED !== 'undefined' && FIRESTORE_ENABLED) {
        try {
            await saveOrderToFirestore(o);
        } catch (e) {
            console.warn('Error guardando estado de pedido en Firestore', e);
        }
    }
    // Re-render using the current filter; keep order where it is (Enviado stays Enviado)
    renderOrders(currentOrderFilter);
}

function viewOrderDetail(id) {
    const orders = loadOrders();
    const o = orders.find(x=>x.id===id);
    if (!o) return alert('Pedido no encontrado');
    const itemsList = o.items.map(it=>`${it.qty}× ${it.nombre} ($${it.price.toFixed(2)})`).join('\n');
    alert(`Pedido: ${o.id}\nCliente: ${o.cliente}\nFecha: ${o.createdAtReadable}\nMétodo: ${o.paymentMethod || '—'}\n\nItems:\n${itemsList}\n\nTotal: $${o.total.toFixed(2)}`);
}

// Inicializar pestañas de pedidos si están presentes
document.addEventListener('DOMContentLoaded', ()=>{
    const tabs = document.querySelectorAll('.tabs-pedidos .tab');
    if (tabs && tabs.length) {
        tabs.forEach(t=>t.addEventListener('click', function(){
            tabs.forEach(x=>x.classList.remove('active'));
            this.classList.add('active');
            const label = this.innerText.toLowerCase();
            if (label.includes('pendientes')) renderOrders('Pendientes');
            else if (label.includes('enviados')) renderOrders('Enviados');
            else if (label.includes('cancelados')) renderOrders('Cancelados');
            else renderOrders('Todos');
        }));

        // mostrar todos al cargar pedidos.html
        renderOrders('Pendientes');
        try { updatePedidosDayStats(); } catch(e) { /* ignore */ }
    }
});

// Habilitar/Deshabilitar botón de confirmar según checkbox de términos
document.addEventListener('DOMContentLoaded', ()=>{
    const terms = document.getElementById('terms-checkbox');
    const confirmBtn = document.getElementById('confirm-purchase-btn');
    if (!terms || !confirmBtn) return;
    // set initial state
    confirmBtn.disabled = !terms.checked;
    terms.addEventListener('change', () => {
        confirmBtn.disabled = !terms.checked;
    });
});

// Setup payment selection highlight
function setupPaymentSelection() {
    const payInputs = document.querySelectorAll('input[name="pay"]');
    if (!payInputs || payInputs.length === 0) return;
    payInputs.forEach(input => {
        // ensure label can receive class; input is inside label
        input.addEventListener('change', () => {
            // remove class from all labels
            payInputs.forEach(i => {
                if (i.parentElement) i.parentElement.classList.remove('pay-selected');
            });
            if (input.parentElement) input.parentElement.classList.add('pay-selected');
        });
        // if already checked on load, mark parent
        if (input.checked && input.parentElement) input.parentElement.classList.add('pay-selected');
    });
}

document.addEventListener('DOMContentLoaded', setupPaymentSelection);

function adjustStock(nombre, delta) {
    try {
        const products = loadProducts();
        const p = products.find(x=>x.nombre === nombre);
        if (!p) return alert('Producto no encontrado');

        if (delta < 0) {
            const reserved = (window.cart || []).reduce((s,it)=> it.nombre===nombre ? s+it.qty : s, 0);
            if (p.stock + delta < reserved) {
                return alert('No puede reducir el stock por debajo de la cantidad reservada en el carrito.');
            }
            p.stock = Math.max(0, p.stock + delta);
        } else {
            p.stock = (p.stock || 0) + delta;
        }
        saveProducts(products);
        // refresh UI
        if (document.getElementById('products-grid')) renderProductos();
        if (document.getElementById('cart-items-list')) renderCart();
    } catch (e) { console.error('Error adjusting stock', e); alert('Error al ajustar inventario'); }
}

function adjustPrice(nombre, newPrice) {
    try {
        const products = loadProducts();
        const p = products.find(x=>x.nombre === nombre);
        if (!p) return alert('Producto no encontrado');
        p.price = Number(newPrice);
        saveProducts(products);
        // update cart items using this product
        let changed = false;
        (window.cart || []).forEach(it => {
            if (it.nombre === nombre) {
                it.price = Number(newPrice);
                changed = true;
            }
        });
        if (changed) {
            renderCart();
            upsertCurrentCartFromMemory();
        }
        // refresh product grid
        if (document.getElementById('products-grid')) renderProductos();
    } catch (e) { console.error('Error adjusting price', e); alert('Error al actualizar precio'); }
}

/* ------------------ Clientes ------------------ */
const CLIENTS_KEY = 'lupita_clients_v1';

function loadClients() {
    try {
        const raw = localStorage.getItem(CLIENTS_KEY);
        let arr = raw ? JSON.parse(raw) : [];
        // migrate old formats if needed
        if (!Array.isArray(arr)) arr = [];
        return arr;
    } catch (e) {
        console.error('Error loading clients', e);
        return [];
    }
}

function saveClients(clients) {
    try { localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients)); }
    catch (e) { console.error('Error saving clients', e); }
}

function getClientDataFromCheckout() {
    const nameInput = document.getElementById('cliente-name');
    if (!nameInput || !nameInput.value.trim()) return null;
    const phoneInput = document.getElementById('telefono');
    const addressInput = document.getElementById('direccion');
    const cityInput = document.getElementById('ciudad');
    const stateInput = document.getElementById('estado-codigo');
    const postalInput = document.getElementById('codigo-postal');

    const clientName = nameInput.value.trim();
    const clientPhone = phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : '';
    const addressParts = [];
    if (addressInput && addressInput.value.trim()) addressParts.push(addressInput.value.trim());
    if (cityInput && cityInput.value.trim()) addressParts.push(cityInput.value.trim());
    if (stateInput && stateInput.value.trim()) addressParts.push(stateInput.value.trim());
    if (postalInput && postalInput.value.trim()) addressParts.push(postalInput.value.trim());

    return {
        name: clientName,
        phone: clientPhone,
        address: addressParts.join(', ')
    };
}

function addClientFromOrder(clientData, order) {
    if (!clientData || !clientData.name || clientData.name.toLowerCase() === 'mostrador') return;
    const clients = loadClients();
    const normalizedName = clientData.name.toLowerCase();
    let existing = clients.find(c => (c.phone && clientData.phone && c.phone === clientData.phone) || (c.name && c.name.toLowerCase() === normalizedName));
    const purchaseItems = (order && order.items) ? order.items.map(it => ({ product: it.nombre, qty: it.qty, date: order.createdAt, orderId: order.id })) : [];
    const purchaseQty = purchaseItems.reduce((sum, it) => sum + (it.qty || 0), 0);

    if (existing) {
        if (!existing.phone && clientData.phone) existing.phone = clientData.phone;
        if (!existing.address && clientData.address) existing.address = clientData.address;
        existing.purchases = existing.purchases || [];
        existing.purchases.push(...purchaseItems);
        existing.totalPurchases = (existing.totalPurchases || 0) + purchaseQty;
    } else {
        const newClient = {
            id: 'CL-' + Date.now().toString().slice(-6),
            name: clientData.name,
            phone: clientData.phone,
            address: clientData.address,
            creditLimit: 0,
            balanceDue: 0,
            totalPurchases: purchaseQty,
            purchases: purchaseItems
        };
        clients.unshift(newClient);
    }
    saveClients(clients);
    // If the clients UI is visible, refresh it so the new client appears immediately
    try {
        if (document.getElementById('clients-grid')) {
            const activeFilterBtn = document.querySelector('.clients-top .filter-btn.active') || document.querySelector('.quick-filters .filter-btn.active');
            const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
            const qEl = document.getElementById('clients-search');
            const q = qEl ? qEl.value : '';
            renderClients(filter, q);
        }
    } catch (e) { /* ignore UI errors */ }
}

function ensureSampleClients() {
    const c = loadClients();
    if (c.length === 0) {
        const sample = [
            { id: 'CL-1001', name: 'Doña María', phone: '55 1234 0001', address: 'Av. Central 12', creditLimit: 500, balanceDue: 120, totalPurchases: 24, purchases: [{product:'Pan Blanco', qty:2, date: new Date().toISOString()}] },
            { id: 'CL-1002', name: 'Juan Pérez', phone: '55 9876 4321', address: 'Calle Fiesta 8', creditLimit: 300, balanceDue: 0, totalPurchases: 8, purchases: [{product:'Coca-Cola 2L', qty:3, date: new Date().toISOString()}] }
        ];
        saveClients(sample);
        return sample;
    }
    return c;
}

function renderClients(filter = 'all', query = '') {
    const grid = document.getElementById('clients-grid');
    if (!grid) return;
    let clients = loadClients();

    // filter by quick filters
    if (filter === 'credit') clients = clients.filter(c => c.balanceDue && c.balanceDue > 0);
    else if (filter === 'frequent') clients = clients.filter(c => (c.totalPurchases || 0) >= 10);

    // search
    if (query && query.trim().length) {
        const q = query.toLowerCase();
        clients = clients.filter(c => (c.name||'').toLowerCase().includes(q) || (c.phone||'').toLowerCase().includes(q) || (c.id||'').toLowerCase().includes(q));
    }

    grid.innerHTML = '';
    if (clients.length === 0) {
        grid.innerHTML = '<p>No se encontraron clientes.</p>';
        return;
    }

    clients.forEach(c => {
        const card = document.createElement('div');
        card.className = 'client-card';
        if (c.balanceDue && c.creditLimit && c.balanceDue >= c.creditLimit) card.classList.add('credit-alert');
        const initials = c.name ? c.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : 'CL';
        const lastPurchases = (c.purchases || []).slice(-5).reverse().map(p=>`${p.qty}× ${p.product}`).join(', ');
        card.innerHTML = `
            <div class="client-meta">
                <div class="client-avatar">${initials}</div>
                <div class="client-info">
                    <div class="client-name">${c.name || '—'}</div>
                    <div class="client-phone">${c.phone || ''} • ${c.id || ''}</div>
                    <div class="client-last">${lastPurchases ? 'Últimos: '+ lastPurchases : ''}</div>
                </div>
            </div>
            <div class="client-stats">
                <div class="client-balance ${c.balanceDue && c.balanceDue>0 ? 'due' : 'ok'}">${c.balanceDue && c.balanceDue>0 ? '$'+c.balanceDue.toFixed(2) : 'Al corriente'}</div>
                <div style="font-size:0.85rem; color:#666">Compras: ${c.totalPurchases||0}</div>
                <div class="client-actions">
                    <button class="btn-sm btn-feedback" data-id="${c.id}" title="Queja / Sugerencia"><i class="fas fa-comment-dots"></i></button>
                    <button class="btn-sm btn-view-history" data-id="${c.id}"><i class="fas fa-history"></i></button>
                    <button class="btn-sm btn-edit-client" data-id="${c.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-new-sale" data-id="${c.id}"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // attach actions
    grid.querySelectorAll('.btn-feedback').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); openClientFeedbackModal(id);
    }));
    grid.querySelectorAll('.btn-view-history').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); viewClientHistory(id);
    }));
    grid.querySelectorAll('.btn-edit-client').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); openClientPanel(id);
    }));
    grid.querySelectorAll('.btn-new-sale').forEach(b=>b.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id'); startNewSaleForClient(id);
    }));
}

function viewClientHistory(id) {
    const clients = loadClients();
    const c = clients.find(x=>x.id===id);
    if (!c) return alert('Cliente no encontrado');
    const purchases = (c.purchases||[]).slice(-10).reverse().map(p=>`${new Date(p.date).toLocaleDateString()} - ${p.qty}× ${p.product}`).join('\n');
    alert(`Historial de ${c.name}:\n\n${purchases || 'Sin compras registradas'}`);
}

function makeIndexPath() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/') || path.includes('\\admin\\')) return 'index.html';
    return 'index.html';
}

function startNewSaleForClient(id) {
    // Store selected client and redirect to catálogo para crear venta
    const clients = loadClients();
    const c = clients.find(x=>x.id===id);
    if (!c) return alert('Cliente no encontrado');
    localStorage.setItem('lupita_selected_client', JSON.stringify({ id: c.id, name: c.name }));
    // redirect to catalog and focus
    location.href = makeIndexPath();
}

function openClientPanel(id) {
    const panel = document.getElementById('client-panel');
    if (!panel) return;
    const title = document.getElementById('panel-title');
    const name = document.getElementById('client-name');
    const phone = document.getElementById('client-phone');
    const address = document.getElementById('client-address');
    const credit = document.getElementById('client-credit');

    if (id) {
        const clients = loadClients();
        const c = clients.find(x=>x.id===id);
        if (c) {
            title.innerText = 'Editar Cliente';
            name.value = c.name || '';
            phone.value = c.phone || '';
            address.value = c.address || '';
            credit.value = c.creditLimit || 0;
            panel.setAttribute('data-edit-id', id);
        }
    } else {
        title.innerText = 'Nuevo Cliente';
        name.value = '';
        phone.value = '';
        address.value = '';
        credit.value = 0;
        panel.removeAttribute('data-edit-id');
    }
    panel.classList.add('open');
}

function closeClientPanel() {
    const panel = document.getElementById('client-panel');
    if (!panel) return;
    panel.classList.remove('open');
}

function saveClientFromPanel() {
    const panel = document.getElementById('client-panel');
    const editId = panel ? panel.getAttribute('data-edit-id') : null;
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const credit = parseFloat(document.getElementById('client-credit').value) || 0;
    if (!name) return alert('El nombre es requerido');

    const clients = loadClients();
    if (editId) {
        const idx = clients.findIndex(x=>x.id===editId);
        if (idx >= 0) {
            clients[idx].name = name;
            clients[idx].phone = phone;
            clients[idx].address = address;
            clients[idx].creditLimit = credit;
        }
    } else {
        const newClient = { id: 'CL-'+Date.now().toString().slice(-6), name, phone, address, creditLimit: credit, balanceDue:0, totalPurchases:0, purchases: [] };
        clients.unshift(newClient);
    }
    saveClients(clients);
    renderClients(document.querySelector('.quick-filters .filter-btn.active') ? document.querySelector('.quick-filters .filter-btn.active').getAttribute('data-filter') : 'all', document.getElementById('clients-search').value);
    closeClientPanel();
}

function openClientFeedbackModal(clientId) {
    const c = loadClients().find(x=>x.id===clientId);
    if (!c) return alert('Cliente no encontrado');
    const modal = document.getElementById('client-feedback-modal');
    if (!modal) return;
    document.getElementById('feedback-client-name').value = c.name || '';
    document.getElementById('feedback-client-contact').value = c.phone || c.email || '';
    document.getElementById('feedback-order-id').value = '';
    document.getElementById('feedback-message').value = '';
    modal.classList.add('open');
    modal.dataset.clientId = clientId;
}

function closeClientFeedbackModal() {
    const modal = document.getElementById('client-feedback-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.dataset.clientId = '';
}

function submitClientFeedback() {
    const modal = document.getElementById('client-feedback-modal');
    if (!modal) return;
    const clientId = modal.dataset.clientId;
    const client = loadClients().find(x=>x.id===clientId);
    if (!client) return alert('Cliente no encontrado');
    const orderId = document.getElementById('feedback-order-id').value.trim();
    const message = document.getElementById('feedback-message').value.trim();
    if (!message) return alert('Escribe el contenido de la queja o sugerencia.');
    const report = {
        orderId: orderId || null,
        cliente: client.name,
        telefono: client.phone || null,
        email: client.email || null,
        message,
        tipo: 'Queja/Sugerencia'
    };
    const ok = submitClientReport(report);
    if (ok) {
        alert('Queja o sugerencia registrada con éxito.');
        closeClientFeedbackModal();
        if (document.querySelector('.reports-page')) renderReports();
    } else {
        alert('Error al registrar el reporte. Intenta nuevamente.');
    }
}

// Setup clients UI on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
    ensureSampleClients();
    const search = document.getElementById('clients-search');
    const grid = document.getElementById('clients-grid');
    const newBtn = document.getElementById('new-client-btn');
    const filters = document.querySelectorAll('.clients-top .filter-btn, .quick-filters .filter-btn');

    if (search) {
        search.addEventListener('input', (e)=> renderClients(document.querySelector('.clients-top .filter-btn.active') ? document.querySelector('.clients-top .filter-btn.active').getAttribute('data-filter') : 'all', e.target.value));
    }
    if (newBtn) newBtn.addEventListener('click', ()=> openClientPanel());

    // wire quick filters
    document.querySelectorAll('.clients-top .filter-btn, .quick-filters .filter-btn').forEach(b=>{
        b.addEventListener('click', function(){
            document.querySelectorAll('.clients-top .filter-btn, .quick-filters .filter-btn').forEach(x=>x.classList.remove('active'));
            this.classList.add('active');
            const f = this.getAttribute('data-filter') || 'all';
            const q = document.getElementById('clients-search') ? document.getElementById('clients-search').value : '';
            renderClients(f, q);
        });
    });

    renderClients('all', '');
});
