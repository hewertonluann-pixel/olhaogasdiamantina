import { db } from "./firebase.js";
import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const box = document.getElementById("boxPedido");
const avBox = document.getElementById("avaliacaoBox");

/* ============ CARREGAR PEDIDO ============ */

async function carregar() {
  const snap = await getDoc(doc(db, "pedidos", id));

  if (!snap.exists()) {
    box.innerHTML = "Pedido não encontrado";
    return;
  }

  const p = snap.data();

  box.innerHTML = `
    <p><b>Cliente:</b> ${p.cliente_nome}</p>
    <p><b>Endereço:</b> ${p.cliente_endereco}</p>
    <p><b>WhatsApp:</b> ${p.cliente_whatsapp}</p>
    <p><b>Gás:</b> ${p.qnt_gas}</p>
    <p><b>Água:</b> ${p.qnt_agua}</p>
    <p><b>Status:</b> ${p.status}</p>
  `;

  if (p.status === "concluído" && !p.avaliacao) {
    avBox.style.display = "block";
  }
}

carregar();

/* ============ AVALIAÇÃO ============ */

document.getElementById("estrelas").onclick = async (e) => {
  if (!e.target.dataset.n) return;

  const nota = Number(e.target.dataset.n);

  await updateDoc(doc(db, "pedidos", id), {
    avaliacao: nota
  });

  document.getElementById("msgAvaliacao").innerHTML =
    "Obrigado pela sua avaliação! ⭐";

  avBox.style.display = "none";
};
