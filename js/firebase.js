// =======================
// Firebase — Configuração
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc,
  serverTimestamp, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// 🔧 CONFIG DO SEU PROJETO OLHA O GÁS DIAMANTINA
const firebaseConfig = {
  apiKey: "AIzaSyAikIUwmm0OYzj98N_NmKlyA4C2-7mE_Lw",
  authDomain: "olhaogas-diamantina.firebaseapp.com",
  projectId: "olhaogas-diamantina",
  storageBucket: "olhaogas-diamantina.firebasestorage.app",
  messagingSenderId: "225790866999",
  appId: "1:225790866999:web:00a7bb5213c39c3fbff1b2",
  measurementId: "G-LPQCBNGH4Z"
};

// Inicializar App Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// =======================
// FUNÇÕES DO SISTEMA
// =======================

// 🔵 Listar vendedores
export async function listarVendedores() {
  return await getDocs(collection(db, "vendedores"));
}

// 🟢 Criar pedido
export async function criarPedido(pedido) {
  return await addDoc(collection(db, "pedidos"), pedido);
}

// 🟧 Carregar um pedido específico pelo ID
export async function carregarPedido(id) {
  return await getDoc(doc(db, "pedidos", id));
}

// 🟥 Atualizar pedido (status, avaliação, etc.)
export async function atualizarPedido(id, dados) {
  return await updateDoc(doc(db, "pedidos", id), dados);
}

// 🟩 Criar solicitação de vendedor
export async function criarSolicitacao(dados) {
  return await addDoc(collection(db, "solicitacoes_vendedor"), {
    ...dados,
    data: serverTimestamp(),
    status: "pendente"
  });
}

// 🟪 Listar pedidos por WhatsApp (histórico)
export async function listarPedidosPorWhatsApp(zap) {
  const q = query(
    collection(db, "pedidos"),
    where("cliente_whatsapp", "==", zap),
    orderBy("data", "desc")
  );
  return await getDocs(q);
}
