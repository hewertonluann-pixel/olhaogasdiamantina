import { db } from "./firebase.js";
import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const lista = document.getElementById("lista");

document.getElementById("btnBuscar").onclick = async () => {
  const zap = document.getElementById("zap").value;

  if (!zap) {
    alert("Digite seu WhatsApp.");
    return;
  }

  const q = query(
    collection(db, "pedidos"),
    where("cliente_whatsapp", "==", zap)
  );

  const snap = await getDocs(q);

  lista.innerHTML = "";

  snap.forEach(doc => {
    const p = doc.data();

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p><b>Data:</b> ${p.data?.toDate().toLocaleString() || ""}</p>
      <p><b>Gás:</b> ${p.qnt_gas}</p>
      <p><b>Água:</b> ${p.qnt_agua}</p>
      <p><b>Status:</b> ${p.status}</p>
      <p><b>Avaliação:</b> ${p.avaliacao ? "⭐".repeat(p.avaliacao) : "—"}</p>

      <button onclick="window.location='pedido.html?id=${doc.id}'">Ver pedido</button>
    `;

    lista.appendChild(div);
  });

  if (snap.empty) {
    lista.innerHTML = "<p>Nenhum pedido encontrado.</p>";
  }
};
