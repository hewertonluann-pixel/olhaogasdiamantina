import { db, listarVendedores, criarPedido } from "./firebase.js";
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ================================
// QUANTIDADES
// ================================
let qntGas = 1;
let qntAgua = 0;

function atualizarVisor() {
  document.getElementById("qntGas").textContent = qntGas;
  document.getElementById("qntAgua").textContent = qntAgua;
}

document.querySelectorAll(".mais").forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.dataset.prod;
    if (tipo === "gas") qntGas++;
    if (tipo === "agua") qntAgua++;
    atualizarVisor();
  });
});

document.querySelectorAll(".menos").forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.dataset.prod;
    if (tipo === "gas" && qntGas > 1) qntGas--;
    if (tipo === "agua" && qntAgua > 0) qntAgua--;
    atualizarVisor();
  });
});

// ================================
// MODAL "VENDA COM A GENTE"
// ================================
const modal = document.getElementById("modalVendedor");
document.getElementById("btnVenda").addEventListener("click", () => {
  modal.style.display = "flex";
});
document.getElementById("btnFecharSolic").addEventListener("click", () => {
  modal.style.display = "none";
});

document.getElementById("btnEnviarSolic").addEventListener("click", async () => {
  const nome = document.getElementById("solNome").value;
  const zap = document.getElementById("solZap").value;
  const bairro = document.getElementById("solBairro").value;
  const obs = document.getElementById("solObs").value;

  if (!nome || !zap || !bairro) {
    alert("Preencha nome, WhatsApp e bairro.");
    return;
  }

  await addDoc(collection(db, "solicitacoes_vendedor"), {
    nome,
    whatsapp: zap,
    bairro,
    observacao: obs || "",
    status: "pendente",
    data: serverTimestamp()
  });

  alert("Sua solicitação foi enviada!");
  modal.style.display = "none";
});

// ================================
// CARREGAR VENDEDORES
// ================================
const lista = document.getElementById("listaVendedores");

async function carregarVendedores() {
  const snap = await listarVendedores();
  lista.innerHTML = "";

  snap.forEach(doc => {
    const v = doc.data();

    const div = document.createElement("div");
    div.className = "card vendedor";
    div.innerHTML = `
      <img src="${v.fotoURL || 'https://i.pravatar.cc/100'}" class="fotoVend">
      <div class="info">
        <h3>${v.nome}</h3>
        <p>${v.marca || ''} - R$ ${v.preco || ''}</p>
        <p class="status ${v.status}">${v.status}</p>
      </div>
      <button class="btnEscolher" data-id="${doc.id}">Pedir</button>
    `;

    lista.appendChild(div);
  });
}

carregarVendedores();

// ================================
// ENVIAR PEDIDO
// ================================
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btnEscolher")) return;

  const vendedorID = e.target.dataset.id;

  const nome = document.getElementById("cliNome").value;
  const end = document.getElementById("cliEnd").value;
  const zap = document.getElementById("cliZap").value;

  if (!nome || !end || !zap) {
    alert("Preencha todos os seus dados antes de enviar o pedido.");
    return;
  }

  const pedido = {
    cliente_nome: nome,
    cliente_endereco: end,
    cliente_whatsapp: zap,
    vendedor_id: vendedorID,
    status: "solicitado",
    qnt_gas: qntGas,
    qnt_agua: qntAgua,
    data: serverTimestamp()
  };

  const docRef = await criarPedido(pedido);

  window.location.href = `pedido.html?id=${docRef.id}`;
});
