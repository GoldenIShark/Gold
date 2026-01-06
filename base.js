let serverDown = false;
document.getElementById("msg").addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

/* ================= LOGIN ================= */

function login() {
  const username = document.getElementById("name").value.trim();
  if (!username) return alert("Nama tidak boleh kosong");

  setCookie("username", username);
  startChat();
}

let msgInterval = null;

function startChat() {
  document.getElementById("login").style.display = "none";
  loadMessages();
  if (!msgInterval) {
    msgInterval = setInterval(loadMessages, 4000);
  }
}

/* ================= CHAT ================= */

function send() {
  const msg = document.getElementById("msg").value.trim();
  const name = getCookie("username");
  if (!msg || !name) return;

  fetch(API + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: name, message: msg })
  })
    .then(res => {
      if (!res.ok) throw new Error("Send failed");
      document.getElementById("msg").value = "";
      loadMessages();
    })
    .catch(() => {
      if (!serverDown) {
        serverDown = true;
        Serveronoff("server : off")
        systemMessage("⚠️ Pesan gagal dikirim (server offline)");
      }
    });
}

function loadMessages() {
  fetch(API + "/messages")
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      Serveronoff("server : on")
      return res.json();
    })
    .then(data => {
      const ul = document.getElementById("messages");

      // hapus pesan lama (kecuali system)
      ul.querySelectorAll("li:not(.system)").forEach(li => li.remove());

      // kalau server tadi mati → beri pesan online
      if (serverDown) {
        serverDown = false;
        Serveronoff("server : on")
        systemMessage("server online")
      }

      data.forEach(m => {
        const li = document.createElement("li");
        li.innerHTML = `
          <b>${m.username}</b>
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
        Serveronoff("server : off")
        systemMessage("server offline")
      }
    });
}

function Serveronoff(text) {
    const p = document.getElementById("serveronoff");
    if (!p) return;

    p.innerHTML = `<i>${text}</i>`;
}

function systemMessage(text) {
  const ul = document.getElementById("messages");
  if (!ul) return;

  // Cegah pesan sistem dobel
  if ([...ul.children].some(li => li.dataset.system === text)) return;

  const li = document.createElement("li");
  li.className = "system";
  li.dataset.system = text;
  li.innerHTML = `<i>${text}</i>`;
  ul.appendChild(li);

  ul.scrollTop = ul.scrollHeight;
}

setInterval(loadMessages, 4000);

if (getCookie("username")) {
  startChat();
}