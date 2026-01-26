
function esperarProductos() {
  const target = document.getElementById("heroSection");

  if (!target) return;

  const observer = new MutationObserver(() => {
    const productosDiv = document.getElementById("productos");
    if (productosDiv) {
      observer.disconnect();
      cargarProductos();
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: true
  });
}

document.addEventListener("DOMContentLoaded", () => {
  esperarProductos();
});


function cargarProductos(){
  window.productosDiv = document.getElementById('productos');
  window.carritoDiv = document.getElementById('carrito');
  window.totalSpan = document.getElementById('total');

  window.productosData = [];
  window.carrito = {}; // index: { producto, cantidad }

  async function cargarProductos() {
    const res = await fetch('Sections/ventas.json');
    productosData = await res.json();
    renderProductos();
  }

  window.renderProductos = function (index) { // asi para que la funcion se vea de forma global
    productosDiv.innerHTML = '';

    productosData.forEach((p, index) => {
      const sinStock = p.Existencias <= 0;

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="img-box" ><img src="${p.Imagen}" alt="${p.Descripción}"> </div>
        <h3>${p.Descripción}</h3>
        <p>Disponibles: ${p.Existencias}</p>
        ${sinStock ? '<p style="color:#f87171;font-weight:bold">Sin existencia</p>' : ''}
        <p>Precio base: $${p['Precio Promedio']}</p>
        <p class="price">Precio con IVA: $${p['Con Iva']}</p>
        <button class="submit-btn" ${sinStock ? 'disabled' : ''} onclick="agregarCarrito(${index})">Agregar</button>
      `;
      productosDiv.appendChild(card);
    });
  }

  cargarProductos();
}

window.agregarCarrito = function (index) { // asi para que la funcion se vea de forma global
    if (productosData[index].Existencias <= 0) return;

    productosData[index].Existencias--;

    if (!carrito[index]) {
      carrito[index] = { producto: productosData[index], cantidad: 1 };
    } else {
      carrito[index].cantidad++;
    }

    renderProductos();
    renderCarrito();
  }
  
  window.quitarDelCarrito = function (index) { // asi para que la funcion se vea de forma global
    productosData[index].Existencias += carrito[index].cantidad;
    delete carrito[index];
    renderProductos();
    renderCarrito();
  }

 export function renderCarrito() {
    carritoDiv.innerHTML = '';
    let total = 0;

    Object.keys(carrito).forEach(index => {
      const item = carrito[index];
      const subtotal = item.cantidad * item.producto['Con Iva'];
      total += subtotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.producto.Descripción} (x${item.cantidad})</span>
        <span>$${subtotal.toFixed(2)}</span>
        <button onclick="quitarDelCarrito(${index})">❌</button>
      `;
      carritoDiv.appendChild(div);
    });

    totalSpan.textContent = total.toFixed(2);
  }