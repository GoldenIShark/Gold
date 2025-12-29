let serverDown = false;
let isAnimating = false;

const chatBox = document.getElementById("chat");
const profileBox = document.getElementById("profile");

const btnChat = document.querySelector(".ui-btn.chat");
const btnProfile = document.querySelector(".ui-btn.profile");

window.addEventListener("load", () => {
  chatBox.classList.add("active");
  btnChat.classList.add("active");
});

function toggleChat() {
  if (isAnimating) return;
  isAnimating = true;

  if (profileBox.classList.contains("active")) {
    profileBox.classList.remove("active");
    profileBox.classList.add("closing");
    btnProfile.classList.remove("active");

    setTimeout(() => {
      profileBox.classList.remove("closing");
    }, 2000);
  }

  if (chatBox.classList.contains("active")) {
    chatBox.classList.remove("active");
    chatBox.classList.add("closing");
    btnChat.classList.remove("active");

    setTimeout(() => {
      chatBox.classList.remove("closing");
      isAnimating = false;
    }, 2000);
  } else {
    chatBox.classList.add("active");
    btnChat.classList.add("active");

    setTimeout(() => {
      isAnimating = false;
    }, 2000);
  }
}

function toggleProfile() {
  if (isAnimating) return;
  isAnimating = true;

  if (chatBox.classList.contains("active")) {
    chatBox.classList.remove("active");
    chatBox.classList.add("closing");
    btnChat.classList.remove("active");

    setTimeout(() => {
      chatBox.classList.remove("closing");
    }, 2000);
  }

  if (profileBox.classList.contains("active")) {
    profileBox.classList.remove("active");
    profileBox.classList.add("closing");
    btnProfile.classList.remove("active");

    setTimeout(() => {
      profileBox.classList.remove("closing");
      isAnimating = false;
    }, 2000);
  } else {
    profileBox.classList.add("active");
    btnProfile.classList.add("active");

    setTimeout(() => {
      isAnimating = false;
    }, 2000);
  }
}

/* ================= LOGIN ================= */

function login() {
  const username = document.getElementById("name").value.trim();
  if (!username) return alert("Nama tidak boleh kosong");

  setCookie("username", username);
  startChat();
}

function startChat() {
  document.getElementById("login").style.display = "none";
  loadMessages();
}

/* ================= CHAT ================= */

function send() {
  const msg = document.getElementById("msg").value.trim();
  const name = getCookie("NamaUser");
  if (!msg || !name) return;

  fetch(API + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message: msg })
  })
    .then(res => {
      if (!res.ok) throw new Error("Send failed");
      document.getElementById("msg").value = "";
      loadMessages();
    })
    .catch(() => {
      if (!serverDown) {
        serverDown = true;
        systemMessage("⚠️ Pesan gagal dikirim (server offline)");
      }
    });
}

function loadMessages() {
  fetch(API + "/messages")
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(data => {
      const ul = document.getElementById("messages");

      // hapus pesan lama (kecuali system)
      ul.querySelectorAll("li:not(.system)").forEach(li => li.remove());

      // kalau server tadi mati → beri pesan online
      if (serverDown) {
        systemMessage("✅ Server kembali online");
        serverDown = false;
      }

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
        systemMessage("⚠️ Server tidak aktif / offline");
      }
    });
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

function gohome() {
    alert("home belum tersedia");
}

setInterval(loadMessages, 4000);

if (getCookie("username")) {
  startChat();
}
