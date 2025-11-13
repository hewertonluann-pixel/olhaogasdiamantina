import { 
  listarVendedores, 
  criarPedido 
} from "./firebase.js";

// Elementos
const lista = document.getElementById("listaVendedores");
const form = document.getElementById("formPedido");

const cliNome = document.getElementById("cliNome");
const cliEnd = document.getElementById("cliEnd");
const cliZap = document.getElementById("cliZap");
const cliVend = document.getElementById("cliVend");

const btnEnviar = document.getElementById("btnEnviar");
const btnCancelar = document.getElementById("btnCancelar");

let vendedorSelecionado = null;

// =========================
// 1. Carregar vendedores
// =========================
async function carregarVendedores() {
  lista.innerHTML = "<p>Carregando...</p>";

  const snap = await listarVendedores();
  lista.innerHTML = "";

  snap.forEach(doc => {
    const v = doc.data();
    const id = doc.id;

    const card = document.createElement("div");
    card.className = "card vendedor";

    card.innerHTML = `
      <img src="${v.fotoURL}" class="fotoVend">
      <div class="info">
        <h3>${v.nome}</h3>
        <p>Marca: ${v.marca}</p>
        <p>Preço: R$ ${v.preco}</p>
        <span class="status ${v.status}">${v.status}</span>
      </div>
      <button class="btnPedir">Pedir agora</button>
    `;

    // clique em pedir
    card.querySelector(".btnPedir").addEventListener("click", () => {
      vendedorSelecionado = { id, ...v };
      abrirFormulario();
    });

    lista.appendChild(card);
  });
}

carregarVendedores();

// =========================
// 2. Abrir formulário
// =========================
function abrirFormulario() {
  cliVend.value = vendedorSelecionado.nome;
  form.style.display = "block";
  window.scrollTo(0, document.body.scrollHeight);
}

// =========================
// 3. Cancelar
// =========================
btnCancelar.addEventListener("click", () => {
  form.style.display = "none";
  vendedorSelecionado = null;
});

// =========================
// 4. Enviar Pedido
// =========================
btnEnviar.addEventListener("click", async () => {
  if (!cliNome.value || !cliEnd.value || !cliZap.value) {
    alert("Preencha todas as informações.");
    return;
  }

  const pedido = {
    cliente_nome: cliNome.value,
    cliente_endereco: cliEnd.value,
    cliente_whatsapp: cliZap.value,
    vendedor_id: vendedorSelecionado.id,
    status: "solicitado"
  };

  const docRef = await criarPedido(pedido);

  // Redireciona para acompanhamento
  window.location.href = `pedido.html?id=${docRef.id}`;
});
