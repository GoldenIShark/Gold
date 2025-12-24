const API = "https://4e5e4809-2156-449e-aa26-3e6605bbda59-00-tp0i6bl5yt5f.pike.replit.dev";

// COOKIE
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(r => r.startsWith(name + "="))
    ?.split("=")[1];
}

// VALIDASI NAMA
function validName(name) {
  if (name.length > 15) return false;
  if ((name.match(/[@#$]/g) || []).length > 2) return false;
  if ((name.match(/[0-9]/g) || []).length > 3) return false;
  return true;
}

// LOGIN
function login() {
  const name = document.getElementById("name").value.trim();
  const error = document.getElementById("error");
  error.textContent = "";

  if (!validName(name)) {
    error.textContent = "Nama tidak valid!";
    return;
  }

  fetch(API + "/ping")
    .then(() => {
      setCookie("NamaUser", name, 7);
      startChat();
    })
    .catch(() => {
      error.textContent = "Server tidak aktif!";
    });
}

// START CHAT
function startChat() {
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
  loadMessages();
}

// SEND PESAN
function send() {
  const msg = document.getElementById("msg").value.trim();
  const name = getCookie("NamaUser");
  if (!msg || !name) return;

  fetch(API + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message: msg })
  }).catch(() => alert("Server offline"));

  document.getElementById("msg").value = "";
}

// LOAD PESAN (HANYA SAAT LOAD)
function loadMessages() {
  fetch(API + "/messages")
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById("messages");
      ul.innerHTML = "";

      data.forEach(m => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${m.name}</strong><br>
          ${m.message}<br>
          <small>${m.time}</small>
        `;
        ul.appendChild(li);
      });
    })
    .catch(() => alert("Server offline"));
}

// AUTO LOGIN
if (getCookie("NamaUser")) {
  startChat();
}