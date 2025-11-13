import { 
  auth, 
  loginGoogle, 
  logout, 
  registrarUsuario,
  atualizarVendedor,
  db
} from "./firebase.js";

import {
  collection, doc, onSnapshot, getDoc, getDocs,
  updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ELEMENTOS
const areaLogin = document.getElementById("areaLogin");
const areaGer = document.getElementById("areaGerente");

const btnLogin = document.getElementById("btnLogin");
const btnSair = document.getElementById("btnSair");

const listaVendedores = document.getElementById("listaVendedores");
const listaPedidos = document.getElementById("listaPedidos");

let uid = null;

// ================================
// 1. LOGIN
// ================================
btnLogin.addEventListener("click", async () => {
  const res = await loginGoogle();
  const user = res.user;

  uid = user.uid;

  // Verifica se é gerente
  const snap = await getDoc(doc(db, "usuarios", uid));

  if (!snap.exists() || snap.data().tipo !== "gerente") {
    alert("Este usuário não é gerente.");
    await logout();
    return;
  }

  areaLogin.style.display = "none";
  areaGer.style.display = "block";

  carregarVendedores();
  carregarPedidos();
});


// ================================
// 2. CARREGAR LISTA DE VENDEDORES
// ================================
function carregarVendedores() {
  onSnapshot(collection(db, "vendedores"), snap => {

    listaVendedores.innerHTML = "";

    snap.forEach(docu => {
      const v = docu.data();
      const id = docu.id;

      const card = document.createElement("div");
      card.className = "card vendedor";

      card.innerHTML = `
        <img src="${v.fotoURL}" class="fotoVend">
        <div class="info">
          <h3>${v.nome}</h3>
          <p>Marca: <input class="inpMarca" value="${v.marca}"></p>
          <p>Preço: R$ <input class="inpPreco" type="number" value="${v.preco}"></p>
          <p>WhatsApp: <input class="inpZap" value="${v.whatsapp}"></p>
          <select class="inpStatus">
            <option value="online">Online</option>
            <option value="ocupado">Ocupado</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <button class="btnSalvarVend">Salvar</button>
      `;

      // Seletores internos
      const inpMarca = card.querySelector(".inpMarca");
      const inpPreco = card.querySelector(".inpPreco");
      const inpZap = card.querySelector(".inpZap");
      const inpStatus = card.querySelector(".inpStatus");
      const btnSalvarVend = card.querySelector(".btnSalvarVend");

      inpStatus.value = v.status;

      btnSalvarVend.addEventListener("click", async () => {
        await atualizarVendedor(id, {
          marca: inpMarca.value,
          preco: Number(inpPreco.value),
          whatsapp: inpZap.value,
          status: inpStatus.value
        });

        alert("Vendedor atualizado!");
      });

      listaVendedores.appendChild(card);
    });
  });
}


// ================================
// 3. CARREGAR TODOS OS PEDIDOS
// ================================
function carregarPedidos() {
  onSnapshot(collection(db, "pedidos"), snap => {
    listaPedidos.innerHTML = "";

    snap.forEach(docu => {
      const p = docu.data();
      const pid = docu.id;

      const card = document.createElement("div");
      card.className = "card pedido";

      card.innerHTML = `
        <h3>${p.cliente_nome}</h3>
        <p>Endereço: ${p.cliente_endereco}</p>
        <p>WhatsApp: ${p.cliente_whatsapp}</p>
        <p>Vendedor atual: <b>${p.vendedor_id}</b></p>
        <p>Status: <b>${p.status}</b></p>

        <label>Reatribuir para:</label>
        <select class="selReatr"></select>

        <button class="btnReatr">Reatribuir</button>
      `;

      const sel = card.querySelector(".selReatr");
      const btn = card.querySelector(".btnReatr");

      montarListaVendedores(sel);

      btn.addEventListener("click", async () => {
        await updateDoc(doc(db, "pedidos", pid), {
          vendedor_id: sel.value
        });
        alert("Pedido reatribuído!");
      });

      listaPedidos.appendChild(card);
    });
  });
}


// Preenche select com vendedores
async function montarListaVendedores(select) {
  const snap = await getDocs(collection(db, "vendedores"));
  snap.forEach(docu => {
    const v = docu.data();
    const option = document.createElement("option");
    option.value = docu.id;
    option.textContent = v.nome;
    select.appendChild(option);
  });
}


// ================================
// 4. SAIR
// ================================
btnSair.addEventListener("click", () => {
  logout();
  location.reload();
});
