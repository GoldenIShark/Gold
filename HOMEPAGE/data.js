/* ================= COOKIE ================= */

function setCookie(key, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(key) {
  return document.cookie
    .split("; ")
    .find(c => c.startsWith(key + "="))
    ?.split("=")[1];
}

/* ================= LOCAL STORAGE ================= */

function saveProfileLocal(data) {
  Object.keys(data).forEach(key => {
    localStorage.setItem("profile_" + key, data[key]);
  });
}

function loadProfileLocal() {
  return {
    nama:    localStorage.getItem("profile_nama")    || "",
    umur:   localStorage.getItem("profile_umur")    || "",
    gender: localStorage.getItem("profile_gender")  || "",
    setatus:localStorage.getItem("profile_setatus") || "",
    hobi:   localStorage.getItem("profile_hobi")    || ""
  };
}

/* ================= FORM ================= */

function loadProfileToForm() {
  const p = loadProfileLocal();

  document.getElementById("p_name").value    = p.nama;
  document.getElementById("p_age").value     = p.umur;
  document.getElementById("p_gender").value  = p.gender;
  document.getElementById("p_setatus").value = p.setatus;
  document.getElementById("p_hobby").value   = p.hobi;
}

/* ================= SAVE PROFILE ================= */

function saveProfileLocalOnly() {
  const data = {
    nama:    document.getElementById("p_name").value,
    umur:   document.getElementById("p_age").value,
    gender: document.getElementById("p_gender").value,
    setatus:document.getElementById("p_setatus").value,
    hobi:   document.getElementById("p_hobby").value
  };

  saveProfileLocal(data);
  systemMessage("💾 Profil disimpan di perangkat");
}

function saveProfile() {
  const username = getCookie("NamaUser");
  if (!username) {
    systemMessage("⚠️ User belum login");
    return;
  }

  const data = {
    nama:    document.getElementById("p_name").value,
    umur:   document.getElementById("p_age").value,
    gender: document.getElementById("p_gender").value,
    setatus:document.getElementById("p_setatus").value,
    hobi:   document.getElementById("p_hobby").value
  };

  fetch(API + "/identitas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      namauser: username,
      name: data.nama,
      status: data.setatus,
      hobi: data.hobi,
      umur: data.umur,
      gender: data.gender
    })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(res => {
      serverDown = false;
      systemMessage("💾 Profil tersimpan ke server");
    })
    .catch(() => {
      serverDown = true;
      systemMessage("⚠️ Profil disimpan lokal (server offline)");
    });
}

/* ================= PROFILE FROM SERVER ================= */

function getProfile() {
  const username = getCookie("NamaUser");
  if (!username) return;

  fetch(API + "/identitas/" + username)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(res => {
      if (res.status !== "ok") return;

      const d = {
        nama: d = res.data.name,
        umur: res.data.umur,
        gender: res.data.gender,
        setatus: res.data.status,
        hobi: res.data.hobi
      };

      saveProfileLocal(d);
      loadProfileToForm();

      serverDown = false;
      systemMessage("ℹ️ Profil dimuat dari server");
    })
    .catch(() => {
      systemMessage("⚠️ Gagal mengambil profil (offline)");
    });
}

/* ================= AUTO LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
  loadProfileToForm();
});