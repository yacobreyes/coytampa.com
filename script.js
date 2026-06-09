const config = window.COY_TAMPA_CONFIG || {};

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const modal = document.querySelector("[data-signup-modal]");
const smsForm = document.querySelector("[data-sms-form]");
const smsNote = document.querySelector("[data-sms-note]");
const contactForm = document.querySelector("[data-contact-form]");
const contactNote = document.querySelector("[data-contact-note]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryStatus = document.querySelector("[data-gallery-status]");

const sampleGallery = [
  {
    caption: "Biblical Feasts",
    permalink: "",
    media_url: "./assets/facebook/facebook-01.jpg"
  },
  {
    caption: "Youth service",
    permalink: "",
    media_url: "./assets/facebook/facebook-02.jpg"
  },
  {
    caption: "Women's ministry",
    permalink: "",
    media_url: "./assets/facebook/facebook-03.jpg"
  },
  {
    caption: "Congregational service",
    permalink: "",
    media_url: "./assets/facebook/facebook-04.jpg"
  },
  {
    caption: "Men's ministry",
    permalink: "",
    media_url: "./assets/facebook/facebook-05.jpg"
  },
  {
    caption: "Missionary outreach",
    permalink: "",
    media_url: "./assets/facebook/facebook-06.jpg"
  }
];

document.querySelector("[data-year]").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

function openSignup() {
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("input").focus();
}

function closeSignup(remember = true) {
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (remember) localStorage.setItem("coySmsPromptSeen", "true");
}

document.querySelectorAll("[data-open-signup]").forEach((button) => {
  button.addEventListener("click", openSignup);
});

document.querySelectorAll("[data-close-signup]").forEach((button) => {
  button.addEventListener("click", () => closeSignup(true));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-visible")) {
    closeSignup(true);
  }
});

window.addEventListener("load", () => {
  if (!localStorage.getItem("coySmsPromptSeen")) {
    setTimeout(openSignup, 700);
  }
});

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

smsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(smsForm);
  const phone = normalizePhone(formData.get("phone") || "");

  if (phone.replace(/\D/g, "").length < 10) {
    smsNote.textContent = "Please enter a valid phone number.";
    return;
  }

  const signups = JSON.parse(localStorage.getItem("coySmsSignups") || "[]");
  signups.push({ phone, createdAt: new Date().toISOString() });
  localStorage.setItem("coySmsSignups", JSON.stringify(signups));
  localStorage.setItem("coySmsPromptSeen", "true");

  smsNote.textContent = "Thank you. You are on the update list.";
  setTimeout(() => closeSignup(false), 900);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactNote.textContent = "Thank you. Your message has been prepared for the church team.";
  contactForm.reset();
});

async function loadInstagramPhotos() {
  renderGallery(sampleGallery, "Photos from C.O.Y. Tampa Casa Del Alfarero.");
}

function renderGallery(items, message) {
  galleryGrid.innerHTML = "";
  galleryStatus.textContent = message;

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "gallery-item";
    card.style.setProperty("--focus-x", `${35 + (index % 4) * 10}%`);

    const img = document.createElement("img");
    img.src = item.media_url || item.thumbnail_url;
    img.alt = item.caption ? item.caption.slice(0, 90) : "Instagram photo";
    img.loading = "lazy";

    const caption = document.createElement("span");
    caption.textContent = item.caption ? item.caption.slice(0, 70) : "C.O.Y. Tampa photo";

    card.append(img, caption);
    galleryGrid.append(card);
  });
}

loadInstagramPhotos();
