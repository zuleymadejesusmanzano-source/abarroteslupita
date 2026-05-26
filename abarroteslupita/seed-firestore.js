// Datos de prueba para Firestore
const SEED_PRODUCTOS = [
    { nombre: "Coca-Cola 600 ml", cat: "Bebidas", img: "coca600.png", price: 20, stock: 18 },
    { nombre: "Coca-Cola 2L", cat: "Bebidas", img: "coca2l.png", price: 35, stock: 15 },
    { nombre: "Pepsi 600 ml", cat: "Bebidas", img: "pepsi600.png", price: 19, stock: 20 },
    { nombre: "Leche Alpura 1L", cat: "Abarrotes", img: "alpura.png", price: 24, stock: 12 },
    { nombre: "Pan Blanco Bimbo", cat: "Abarrotes", img: "bimbo.png", price: 28, stock: 10 }
];

const SEED_PEDIDOS = [
    {
        id: "PED-260524-00001",
        cliente: "María G.",
        createdAt: new Date("2026-05-24"),
        createdAtReadable: "5/24/2026, 4:30:00 PM",
        items: [
            { nombre: "Coca-Cola 600 ml", price: 20, qty: 2 }
        ],
        paymentMethod: "PayPal",
        subtotal: 40,
        tax: 6.4,
        total: 46.4,
        status: "Pendiente"
    },
    {
        id: "PED-260524-00002",
        cliente: "Juan Pérez",
        createdAt: new Date("2026-05-24"),
        createdAtReadable: "5/24/2026, 2:45:00 PM",
        items: [
            { nombre: "Pan Blanco Bimbo", price: 28, qty: 1 },
            { nombre: "Leche Alpura 1L", price: 24, qty: 2 }
        ],
        paymentMethod: "Tarjeta",
        subtotal: 76,
        tax: 12.16,
        total: 88.16,
        status: "Pendiente"
    }
];

async function seedProductosToFirestore() {
    if (!FIRESTORE_ENABLED) {
        alert("Firebase no está conectado");
        return;
    }
    try {
        console.log("Cargando productos de prueba...");
        for (const prod of SEED_PRODUCTOS) {
            await db.collection('productos').add({
                nombre: prod.nombre,
                cat: prod.cat,
                img: prod.img,
                price: prod.price,
                stock: prod.stock
            });
        }
        alert(`✅ ${SEED_PRODUCTOS.length} productos cargados en Firestore`);
        console.log("Productos cargados exitosamente");
    } catch (e) {
        console.error("Error cargando productos:", e);
        alert("❌ Error: " + e.message);
    }
}

async function seedPedidosToFirestore() {
    if (!FIRESTORE_ENABLED) {
        alert("Firebase no está conectado");
        return;
    }
    try {
        console.log("Cargando pedidos de prueba...");
        for (const ped of SEED_PEDIDOS) {
            await db.collection('pedidos').add({
                cliente: ped.cliente,
                items: ped.items,
                paymentMethod: ped.paymentMethod,
                subtotal: ped.subtotal,
                tax: ped.tax,
                total: ped.total,
                status: ped.status,
                createdAt: firebase.firestore.Timestamp.fromDate(ped.createdAt),
                createdAtReadable: ped.createdAtReadable
            });
        }
        alert(`✅ ${SEED_PEDIDOS.length} pedidos cargados en Firestore`);
        console.log("Pedidos cargados exitosamente");
        // Refrescar la tabla de pedidos si está visible
        if (typeof renderOrders === 'function') {
            renderOrders('Pendientes');
        }
    } catch (e) {
        console.error("Error cargando pedidos:", e);
        alert("❌ Error: " + e.message);
    }
}

async function seedAllData() {
    if (!FIRESTORE_ENABLED) {
        alert("Firebase no está conectado");
        return;
    }
    await seedProductosToFirestore();
    await seedPedidosToFirestore();
}

// Función para limpiar la colección de pedidos (solo para desarrollo)
async function clearPedidos() {
    if (!FIRESTORE_ENABLED) return;
    if (!confirm("¿Estás seguro? Esto eliminará TODOS los pedidos.")) return;
    try {
        const snapshot = await db.collection('pedidos').get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        alert("✅ Pedidos eliminados");
    } catch (e) {
        console.error("Error eliminando pedidos:", e);
    }
}

console.log("seed-firestore.js cargado. Usa:");
console.log("  seedProductosToFirestore() - Cargar productos de prueba");
console.log("  seedPedidosToFirestore() - Cargar pedidos de prueba");
console.log("  seedAllData() - Cargar todo");
console.log("  clearPedidos() - Eliminar todos los pedidos");
