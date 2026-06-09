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

const defaultSiteContent = {
  hero: {
    eyebrow: "Welcome home",
    title: "C.O.Y. Tampa, Casa Del Alfarero",
    copy:
      "We are a Messianic congregation in Tampa, Florida. We observe Shabbat and the Biblical Feasts."
  },
  services: [
    {
      label: "Friday night",
      time: "8:00 PM",
      description: "Begin Shabbat with worship, prayer, and a sermon from our pastor."
    },
    {
      label: "Saturday morning",
      time: "11:00 AM",
      description: "Gather with the congregation for our Chumash studies, worship, and fellowship."
    },
    {
      label: "Saturday afternoon",
      time: "3:30 PM",
      description:
        "Continue Shabbat with an afternoon service led by our men's, women's, youth, or children's ministries."
    }
  ],
  about: {
    eyebrow: "About us",
    heading: "A place shaped by faith and family.",
    paragraphs: [
      "Casa Del Alfarero means the Potter's House. We are a Messianic congregation observing the Biblical Feasts, Shabbat, and a life of worship rooted in Scripture.",
      "Whether you are visiting for the first time or looking for a congregation in Tampa, there is a seat for you here on Friday at 8:00 PM, Saturday at 11:00 AM, and Saturday at 3:30 PM."
    ]
  },
  gallery: {
    eyebrow: "Photo gallery",
    heading: "Life at Casa Del Alfarero",
    followPrefix: "Follow us on",
    followSuffix: "for more.",
    photos: [
      {
        caption: "Biblical Feasts",
        media_url: "/assets/facebook/facebook-01.jpg"
      },
      {
        caption: "Youth service",
        media_url: "/assets/facebook/facebook-02.jpg"
      },
      {
        caption: "Women's ministry",
        media_url: "/assets/facebook/facebook-03.jpg"
      },
      {
        caption: "Congregational service",
        media_url: "/assets/facebook/facebook-04.jpg"
      },
      {
        caption: "Men's ministry",
        media_url: "/assets/facebook/facebook-05.jpg"
      },
      {
        caption: "Missionary outreach",
        media_url: "/assets/instagram/instagram-07.jpg"
      }
    ]
  },
  contact: {
    eyebrow: "Contact",
    heading: "Connect with us.",
    cardTitle: "C.O.Y. Tampa, Casa Del Alfarero",
    cardText: "Stay in the know about all our services and events."
  }
};

let siteContent = defaultSiteContent;

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

smsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(smsForm);
  const phone = normalizePhone(formData.get("phone") || "");

  if (phone.replace(/\D/g, "").length < 10) {
    smsNote.textContent = "Please enter a valid phone number.";
    return;
  }

  formData.set("phone", phone);
  formData.set("form-name", "sms-signup");

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });

    if (!response.ok) throw new Error("Form submission failed");

    localStorage.setItem("coySmsPromptSeen", "true");
    smsNote.textContent = "Thank you. You are on the update list.";
    smsForm.reset();
    setTimeout(() => closeSignup(false), 900);
  } catch (error) {
    smsNote.textContent = "Thank you. If this does not appear in Netlify, refresh and try again.";
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactNote.textContent = "Thank you. Your message has been prepared for the church team.";
  contactForm.reset();
});

function getValue(path, source) {
  return path.split(".").reduce((value, key) => {
    if (value === undefined || value === null) return undefined;
    return value[key];
  }, source);
}

function setEditableContent(content) {
  document.querySelectorAll("[data-content]").forEach((element) => {
    const value = getValue(element.dataset.content, content);
    if (typeof value === "string") {
      element.textContent = value;
    }
  });
}

async function loadInstagramPhotos() {
  try {
    const response = await fetch("./content/site.json", { cache: "no-store" });
    if (response.ok) {
      siteContent = await response.json();
      setEditableContent(siteContent);
    }
  } catch (error) {
    siteContent = defaultSiteContent;
  }

  renderGallery(siteContent.gallery?.photos || defaultSiteContent.gallery.photos, "");
}

function renderGallery(items, message) {
  galleryGrid.innerHTML = "";
  galleryStatus.textContent = message;
  galleryStatus.hidden = !message;

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
