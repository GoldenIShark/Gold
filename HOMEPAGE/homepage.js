const API = "https://4e5e4809-2156-449e-aa26-3e6605bbda59-00-tp0i6bl5yt5f.pike.replit.dev";

let serverDown = false;

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
      systemMessage("⚠️ sistem server off (tidak aktif), coba lain kali");
    });
}

function startChat() {
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
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
        systemMessage("⚠️ pesan gagal dikirim, server tidak aktif");
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
        systemMessage("⚠️ sistem server off (tidak aktif), coba lain kali");
      }
    });
}

setInterval(loadMessages, 10000);

if (getCookie("NamaUser")) {
  startChat();
}
