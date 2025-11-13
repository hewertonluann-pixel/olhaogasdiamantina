// ===============================
// Firebase Base – Olha o Gás
// ===============================

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

// ===============================
// CONFIGURAÇÃO REAL DO SEU FIREBASE
// (COLE SUAS CREDENCIAIS AQUI)
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAikIUwmm0OYzj98N_NmKlyA4C2-7mE_Lw",
  authDomain: "olhaogas-diamantina.firebaseapp.com",
  projectId: "olhaogas-diamantina",
  storageBucket: "olhaogas-diamantina.firebasestorage.app",
  messagingSenderId: "225790866999",
  appId: "1:225790866999:web:00a7bb5213c39c3fbff1b2",
  measurementId: "G-LPQCBNGH4Z"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore e Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// ===============================
// AUTENTICAÇÃO
// ===============================
export function loginGoogle() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

// ===============================
// GERENCIAMENTO DE USUÁRIO
// ===============================
export async function registrarUsuario(user, tipo) {
  await setDoc(doc(db, "usuarios", user.uid), {
    nome: user.displayName,
    fotoURL: user.photoURL,
    tipo: tipo
  }, { merge: true });
}

// ===============================
// VENDEDORES
// ===============================
export async function atualizarVendedor(uid, dados) {
  return setDoc(doc(db, "vendedores", uid), dados, { merge: true });
}

export async function listarVendedores() {
  return getDocs(collection(db, "vendedores"));
}

// ===============================
// PEDIDOS
// ===============================
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
