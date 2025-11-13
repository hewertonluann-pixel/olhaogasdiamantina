// ===========================
// Firebase Base – Olha o Gás
// ===========================

// Import dos módulos modernos
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

import {
  getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, serverTimestamp, query, where, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// ===========================
// Config do Firebase
// (você vai colar a sua aqui)
// ===========================
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inicializar
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===========================
// FUNÇÕES DE AUTENTICAÇÃO
// ===========================
export function loginGoogle() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

// ===========================
// GERENCIAMENTO DE USUÁRIO
// ===========================
export async function registrarUsuario(user, tipo) {
  await setDoc(doc(db, "usuarios", user.uid), {
    nome: user.displayName,
    fotoURL: user.photoURL,
    tipo: tipo
  }, { merge: true });
}

// ===========================
// VENDEDORES
// ===========================
export async function atualizarVendedor(uid, dados) {
  return setDoc(doc(db, "vendedores", uid), dados, { merge: true });
}

export async function listarVendedores() {
  return getDocs(collection(db, "vendedores"));
}

// ===========================
// PEDIDOS
// ===========================
export async function criarPedido(dados) {
  dados.timestamp = serverTimestamp();
  return addDoc(collection(db, "pedidos"), dados);
}

export async function acompanharPedido(id, callback) {
  return onSnapshot(doc(db, "pedidos", id), callback);
}

export async function atualizarPedido(id, dados) {
  return updateDoc(doc(db, "pedidos", id), dados);
}
