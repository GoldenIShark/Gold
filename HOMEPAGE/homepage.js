const API = "https://4e5e4809-2156-449e-aa26-3e6605bbda59-00-tp0i6bl5yt5f.pike.replit.dev";

let serverDown = false;

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function toggleChat() {
  const chat = document.getElementById("chat");
  const profile = document.getElementById("profile");
  const btnChat = document.querySelector(".ui-btn.chat");
  const btnProfile = document.querySelector(".ui-btn.profile");

  chat.classList.toggle("active");
  profile.classList.remove("active");

  btnChat.classList.toggle("active");
  btnProfile.classList.remove("active");
}

function goHome() {
  alert("SAAT INI BELUM ADA HALAMAN HOME");
}


function toggleProfile() {
  const profile = document.getElementById("profile");
  const chat = document.getElementById("chat");
  const btnProfile = document.querySelector(".ui-btn.profile");
  const btnChat = document.querySelector(".ui-btn.chat");

  profile.classList.toggle("active");
  chat.classList.remove("active");

  btnProfile.classList.toggle("active");
  btnChat.classList.remove("active");
}

function loadProfile() {
  document.getElementById("p_name").value =
    localStorage.getItem("p_name") || "";

  document.getElementById("p_status").value =
    localStorage.getItem("p_status") || "";

  document.getElementById("p_hobby").value =
    localStorage.getItem("p_hobby") || "";

  document.getElementById("p_age").value =
    localStorage.getItem("p_age") || "";

  document.getElementById("p_gender").value =
    localStorage.getItem("p_gender") || "";
}

function saveProfile() {
  localStorage.setItem("p_name", document.getElementById("p_name").value);
  localStorage.setItem("p_status", document.getElementById("p_status").value);
  localStorage.setItem("p_hobby", document.getElementById("p_hobby").value);
  localStorage.setItem("p_age", document.getElementById("p_age").value);
  localStorage.setItem("p_gender", document.getElementById("p_gender").value);

  alert("Profil disimpan ✅");
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(r => r.startsWith(name + "="))
    ?.split("=")[1];
}

function login() {
  const name = document.getElementById("name").value.trim();
  if (!name) return;

  fetch(API + "/ping")
    .then(() => {
      setCookie("NamaUser", name, 7);
      startChat();
    })
    .catch(() => {
      setCookie("NamaUser", name, 7);
      startChat();
      serverDown = true;
      systemMessage("⚠️ server sedang mode SAD, cobalah kembali lain waktu \n server mungkin sedang memulihkan perasaan.");
    });
}

function startChat() {
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").classList.add("active");

  loadProfile();
  loadMessages();
}

function send() {
  const msg = document.getElementById("msg").value.trim();
  const name = getCookie("NamaUser");
  if (!msg || !name) return;

  fetch(API + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message: msg })
  })
    .then(() => {
      document.getElementById("msg").value = "";
      setTimeout(loadMessages, 150);
    })
    .catch(() => {
      if (!serverDown) {
        serverDown = true;
        systemMessage("⚠️ pesan gagal dikirim\nmungkin server sudah tidak menerima anda\n harap coba lain waktu");
      }
    });
}

function systemMessage(text) {
  const ul = document.getElementById("messages");
  if (!ul) return;

  const li = document.createElement("li");
  li.className = "system";
  li.dataset.system = "true";
  li.innerHTML = `<i>${text}</i>`;
  ul.appendChild(li);

  ul.scrollTop = ul.scrollHeight;
}

function loadMessages() {
  fetch(API + "/messages")
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById("messages");

      ul.querySelectorAll("li:not([data-system])").forEach(li => li.remove());

      serverDown = false;

      data.forEach(m => {
        const li = document.createElement("li");
        li.innerHTML = `
          <b>${m.name}</b><br>
          ${m.message}<br>
          <small>${m.time}</small>
        `;
        ul.appendChild(li);
      });

      ul.scrollTop = ul.scrollHeight;
    })
    .catch(() => {
      if (!serverDown) {
        serverDown = true;
        systemMessage("⚠️ server sedang mode SAD, cobalah kembali lain waktu \n server mungkin sedang memulihkan perasaan.");
      }
    });
}

setInterval(loadMessages, 4000);

if (getCookie("NamaUser")) {
  startChat();
}