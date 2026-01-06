//function playClick() {
//    const sound = new Audio("click.mp3");
//    sound.play();
//}

function playClick() {
  const sound = new Audio("click.mp3");
  sound.play();
}
//=======================================


let isAnimating = false;

const chatBox    = document.getElementById("chat");
const profileBox = document.getElementById("profile");

const btnChat    = document.querySelector(".ui-btn.chat");
const btnProfile = document.querySelector(".ui-btn.profile");

const homeBox    = document.querySelector(".Home-box");
const btnHome    = document.querySelector(".ui-btn.Home");

window.addEventListener("load", () => {
  homeBox.classList.add("active");
  btnHome.classList.add("active");
});


function closeBox(box, btn) {
    if (!box.classList.contains("active")) return;
    box.classList.remove("active");
    box.classList.add("closing");
    btn.classList.remove("active");
    setTimeout(() => {
        box.classList.remove("closing");
    }, 1500);
}


function toggleChat() {
    if (isAnimating) return;
        isAnimating = true;
        closeBox(profileBox, btnProfile);
        closeBox(homeBox, btnHome);
    if (chatBox.classList.contains("active")) {
        closeBox(chatBox, btnChat);
    } else {
        chatBox.classList.add("active");
        btnChat.classList.add("active");
    }
    setTimeout(() => isAnimating = false, 1500);
}


function toggleProfile() {
    if (isAnimating) return;
        isAnimating = true;
        closeBox(chatBox, btnChat);
        closeBox(homeBox, btnHome);
    if (profileBox.classList.contains("active")) {
        closeBox(profileBox, btnProfile);
    } else {
        profileBox.classList.add("active");
        btnProfile.classList.add("active");
    }
    setTimeout(() => isAnimating = false, 1500);
}


function gohome() {
    if (isAnimating) return;
        isAnimating = true;
        closeBox(chatBox, btnChat);
        closeBox(profileBox, btnProfile);
    if (homeBox.classList.contains("active")) {
        closeBox(homeBox, btnHome);
    } else {
        homeBox.classList.add("active");
        btnHome.classList.add("active");
    }
    setTimeout(() => isAnimating = false, 1500);
}
