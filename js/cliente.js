import { db, listarVendedores, criarPedido } from "./firebase.js";
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/* BOTÃO HISTÓRICO */
document.getElementById("btnHistorico").onclick = () => {
  window.location.href = "historico.html";
};

/* ============ MODAL VENDER ============ */
const modal = document.getElementById("modalVendedor");

document.getElementById("btnVenda").onclick = () => modal.style.display = "flex";
document.getElementById("btnFecharSolic").onclick = () => modal.style.display = "none";

document.getElementById("btnEnviarSolic").onclick = async () => {
  const nome = solNome.value;
  const zap = solZap.value;
  const bairro = solBairro.value;
  const obs = solObs.value;

  if (!nome || !zap || !bairro) {
    alert("Preencha nome, WhatsApp e bairro.");
    return;
  }

  await addDoc(collection(db, "solicitacoes_vendedor"), {
    nome,
    whatsapp: zap,
    bairro,
    observacao: obs,
    status: "pendente",
    data: serverTimestamp()
  });

  alert("Solicitação enviada!");
  modal.style.display = "none";
};

/* ============ CARREGAR VENDEDORES ============ */

const lista = document.getElementById("listaVendedores");

async function carregarVendedores() {
  const snap = await listarVendedores();
  lista.innerHTML = "";

  snap.forEach(doc => {
    const v = doc.data();

    const div = document.createElement("div");
    div.className = "card vendedor";

    div.innerHTML = `
      <div class="vend-top">
        <img src="${v.fotoURL || 'https://i.pravatar.cc/100'}" class="fotoVend">
        <div class="info">
          <h3>${v.nome}</h3>
          <p>${v.marca || ''} - R$ ${v.preco || ''}</p>
          <p class="status ${v.status}">${v.status}</p>
          <p class="tempo">⏱️ Entrega: ${v.tempo || "20-40 min"}</p>
          <p>⭐ ${v.estrelas?.toFixed(1) || "0.0"} (${v.totalAvaliacoes || 0})</p>
        </div>
      </div>

      <!-- GÁS -->
      <div class="produtoVend">
        <div class="icon-text">
          <span class="icon">🔥</span> Gás 13kg
        </div>
        <div class="controls" data-id="${doc.id}" data-prod="gas" data-preco="${v.preco}">
          <button class="menosVend">-</button>
          <span id="gas_${doc.id}" class="qntVend">1</span>
          <button class="maisVend">+</button>
        </div>
      </div>

      <!-- AGUA -->
      <div class="produtoVend">
        <div class="icon-text">
          <span class="icon">💧</span> Água 20L
        </div>
        <div class="controls" data-id="${doc.id}" data-prod="agua" data-preco="${v.preco_agua || 10}">
          <button class="menosVend">-</button>
          <span id="agua_${doc.id}" class="qntVend">0</span>
          <button class="maisVend">+</button>
        </div>
      </div>

      <div class="totalLinha">
        Total: <span id="total_${doc.id}" class="totalValor">R$ 0,00</span>
      </div>

      <button class="btnEscolher" data-id="${doc.id}">Pedir agora</button>
    `;

    lista.appendChild(div);
  });
}

carregarVendedores();

/* ============ CONTADORES + TOTAL ============ */

function atualizarTotal(vID) {
  const gas = parseInt(document.getElementById(`gas_${vID}`).textContent);
  const agua = parseInt(document.getElementById(`agua_${vID}`).textContent);

  const precoGas = parseFloat(document.querySelector(`[data-id="${vID}"][data-prod="gas"]`).dataset.preco);
  const precoAgua = parseFloat(document.querySelector(`[data-id="${vID}"][data-prod="agua"]`).dataset.preco);

  const total = gas * precoGas + agua * precoAgua;

  document.getElementById(`total_${vID}`).textContent =
    "R$ " + total.toFixed(2).replace(".", ",");
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("maisVend") ||
      e.target.classList.contains("menosVend")) {

    const parent = e.target.closest(".controls");
    const vID = parent.dataset.id;
    const prod = parent.dataset.prod;
    const visor = document.getElementById(`${prod}_${vID}`);

    let val = parseInt(visor.textContent);

    if (e.target.classList.contains("maisVend")) val++;
    if (e.target.classList.contains("menosVend") && val > 0) val--;

    visor.textContent = val;

    atualizarTotal(vID);
  }
});

/* ============ ENVIAR PEDIDO ============ */

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btnEscolher")) return;

  const vendedorID = e.target.dataset.id;

  if (!cliNome.value || !cliEnd.value || !cliZap.value) {
    alert("Preencha seus dados.");
    return;
  }

  const qnt_gas = parseInt(document.getElementById(`gas_${vendedorID}`).textContent);
  const qnt_agua = parseInt(document.getElementById(`agua_${vendedorID}`).textContent);

  const pedido = {
    cliente_nome: cliNome.value,
    cliente_endereco: cliEnd.value,
    cliente_whatsapp: cliZap.value,
    vendedor_id: vendedorID,
    qnt_gas,
    qnt_agua,
    status: "solicitado",
    data: serverTimestamp()
  };

  const ref = await criarPedido(pedido);

  window.location.href = `pedido.html?id=${ref.id}`;
});
