import { 
  db, 
  acompanharPedido 
} from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// -----------------------
// Elementos do HTML
// -----------------------
const statusEl = document.getElementById("status");
const cliNome = document.getElementById("cliNome");
const cliEnd = document.getElementById("cliEnd");
const cliZap = document.getElementById("cliZap");

const vendFoto = document.getElementById("vendFoto");
const vendNome = document.getElementById("vendNome");
const vendMarca = document.getElementById("vendMarca");
const vendPreco = document.getElementById("vendPreco");

const btnZap = document.getElementById("btnZap");

// -----------------------
// Pegar ID do pedido pela URL
// -----------------------
const params = new URLSearchParams(window.location.search);
const pedidoID = params.get("id");

if (!pedidoID) {
  alert("ID do pedido não encontrado.");
}

// -----------------------
// Acompanhar o pedido em tempo real
// -----------------------
acompanharPedido(pedidoID, async (snap) => {

  if (!snap.exists()) {
    alert("Pedido não encontrado.");
    return;
  }

  const pedido = snap.data();

  // Atualiza campos do pedido
  statusEl.textContent = pedido.status;
  cliNome.textContent = pedido.cliente_nome;
  cliEnd.textContent = pedido.cliente_endereco;
  cliZap.textContent = pedido.cliente_whatsapp;

  // Carregar dados do vendedor
  const vendRef = doc(db, "vendedores", pedido.vendedor_id);
  const vendSnap = await getDoc(vendRef);

  if (vendSnap.exists()) {
    const v = vendSnap.data();

    vendFoto.src = v.fotoURL;
    vendNome.textContent = v.nome;
    vendMarca.textContent = v.marca;
    vendPreco.textContent = v.preco;

    // botão WhatsApp
    btnZap.onclick = () => {
      const msg = encodeURIComponent(
        `Olá ${v.nome}, estou acompanhando meu pedido:\n` +
        `Endereço: ${pedido.cliente_endereco}\n` +
        `Status: ${pedido.status}`
      );
      window.open(`https://wa.me/${v.whatsapp}?text=${msg}`, "_blank");
    };
  }
});
