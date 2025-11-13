import { 
  auth, 
  loginGoogle, 
  logout, 
  registrarUsuario,
  atualizarVendedor,
  db 
} from "./firebase.js";

import {
  doc, onSnapshot, collection, query, where, updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ELEMENTOS
const areaLogin = document.getElementById("areaLogin");
const areaVend = document.getElementById("areaVendedor");

const btnLogin = document.getElementById("btnLogin");
const btnSair = document.getElementById("btnSair");
const btnSalvar = document.getElementById("btnSalvar");

const vendFoto = document.getElementById("vendFoto");
const vendNome = document.getElementById("vendNome");
const vendPreco = document.getElementById("vendPreco");
const vendMarca = document.getElementById("vendMarca");
const vendZap = document.getElementById("vendZap");
const vendStatus = document.getElementById("vendStatus");

const listaPedidos = document.getElementById("listaPedidos");

let uid = null;

// ===============================
// 1. LOGIN
// ===============================
btnLogin.addEventListener("click", async () => {
  const res = await loginGoogle();
  const user = res.user;

  uid = user.uid;

  // registra como vendedor
  await registrarUsuario(user, "vendedor");

  carregarVendedor(uid);

  areaLogin.style.display = "none";
  areaVend.style.display = "block";
});

// ===============================
// 2. CARREGAR DADOS DO VENDEDOR
// ===============================
async function carregarVendedor(id) {
  const ref = doc(db, "vendedores", id);

  onSnapshot(ref, snap => {
    if (!snap.exists()) {
      // se não existir, cria com dados básicos
      atualizarVendedor(id, {
        nome: auth.currentUser.displayName,
        fotoURL: auth.currentUser.photoURL,
        preco: 0,
        marca: "",
        whatsapp: "",
        status: "offline"
      });
      return;
    }

    const v = snap.data();

    vendFoto.src = v.fotoURL;
    vendNome.textContent = v.nome;
    vendPreco.value = v.preco;
    vendMarca.value = v.marca;
    vendZap.value = v.whatsapp;
    vendStatus.value = v.status;

    // carrega pedidos do vendedor
    carregarPedidos(id);
  });
}

// ===============================
// 3. SALVAR ALTERAÇÕES
// ===============================
btnSalvar.addEventListener("click", async () => {
  await atualizarVendedor(uid, {
    preco: Number(vendPreco.value),
    marca: vendMarca.value,
    whatsapp: vendZap.value,
    status: vendStatus.value,
  });

  alert("Alterações salvas!");
});

// ===============================
// 4. LISTAR PEDIDOS DO VENDEDOR
// ===============================
function carregarPedidos(id) {
  const ref = collection(db, "pedidos");
  const q = query(ref, where("vendedor_id", "==", id));

  onSnapshot(q, snap => {
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
        <p>Status atual: <b>${p.status}</b></p>

        <select class="selStatus">
          <option value="solicitado">Solicitado</option>
          <option value="aceito">Aceito</option>
          <option value="a_caminho">A caminho</option>
          <option value="concluido">Concluído</option>
        </select>

        <button class="btnAtualizar">Atualizar</button>
      `;

      const sel = card.querySelector(".selStatus");
      const btn = card.querySelector(".btnAtualizar");

      sel.value = p.status;

      btn.addEventListener("click", async () => {
        await updateDoc(doc(db, "pedidos", pid), {
          status: sel.value
        });
        alert("Status atualizado!");
      });

      listaPedidos.appendChild(card);
    });
  });
}

// ===============================
// 5. SAIR
// ===============================
btnSair.addEventListener("click", () => {
  logout();
  location.reload();
});
