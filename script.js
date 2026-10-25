"use strict";

const products = [
  {
    id: "creator-playbook",
    name: "The Creator's Playbook",
    category: "E-books",
    categoryKey: "e-books",
    price: 12,
    badge: "BESTSELLER",
    theme: "art-business",
    coverTitle: "THE<br>CREATOR'S<br>PLAYBOOK",
    kicker: "ROHITX FIELD NOTES",
    tagline: "THINK CLEARER. MAKE MORE.",
    shortDescription: "A practical guide to turning creative ideas into meaningful work.",
    description: "Your ideas deserve a little structure and a lot of room to grow. This practical digital guide helps you move from scattered inspiration to a creative practice that feels sustainable and genuinely yours.",
    includes: ["A simple idea-to-action framework", "Prompts to find your creative direction", "A flexible plan you can make your own"]
  },
  {
    id: "javascript-starter",
    name: "JavaScript, Made Simple",
    category: "Study notes",
    categoryKey: "study-notes",
    price: 8.5,
    badge: "STUDENT PICK",
    theme: "art-code",
    coverTitle: "JAVASCRIPT<br>MADE SIMPLE",
    kicker: "THE CODE NOTES",
    tagline: "CLEAR CONCEPTS. REAL EXAMPLES.",
    shortDescription: "Friendly, well-organized notes for learning JavaScript fundamentals.",
    description: "A clear, approachable set of JavaScript study notes that breaks core concepts into bite-size explanations and readable examples. A handy companion for your learning sessions.",
    includes: ["Variables, functions, and arrays", "DOM basics and event handling", "Quick-reference examples and recap notes"]
  },
  {
    id: "study-focus",
    name: "The Focus Study Guide",
    category: "Study notes",
    categoryKey: "study-notes",
    price: 6,
    badge: "QUICK READ",
    theme: "art-focus",
    coverTitle: "THE FOCUS<br>STUDY GUIDE",
    kicker: "STUDY BETTER",
    tagline: "FOCUS YOUR TIME. KEEP YOUR FLOW.",
    shortDescription: "Simple study routines and focus techniques for busy learners.",
    description: "A compact guide to making study time feel more intentional. Explore practical routines for getting started, protecting your focus, and reviewing what you learn.",
    includes: ["A flexible study session structure", "Focus and break-time ideas", "A printable weekly study planner"]
  },
  {
    id: "notion-student-kit",
    name: "Student Dashboard Kit",
    category: "Templates",
    categoryKey: "templates",
    price: 9,
    badge: "READY TO USE",
    theme: "art-notes",
    coverTitle: "STUDENT<br>DASHBOARD",
    kicker: "THE NOTION KIT",
    tagline: "YOUR SEMESTER, IN SYNC.",
    shortDescription: "A clean planning template for classes, tasks, and study goals.",
    description: "Bring your semester into one calm, organized space. This student dashboard template gives you a straightforward starting point for planning classes, tracking tasks, and keeping your goals in view.",
    includes: ["Class and assignment planner", "Weekly overview and study tracker", "Easy-to-adapt dashboard layout"]
  },
  {
    id: "personal-brand",
    name: "Personal Brand Workbook",
    category: "Workbooks",
    categoryKey: "workbooks",
    price: 11,
    badge: "NEW RELEASE",
    theme: "art-workbook",
    coverTitle: "PERSONAL<br>BRAND<br>WORKBOOK",
    kicker: "BUILD YOUR STORY",
    tagline: "MAKE IT CLEAR. MAKE IT YOU.",
    shortDescription: "Guided prompts to help you shape a confident, authentic brand.",
    description: "Find the words, values, and point of view that make your personal brand feel like you. This guided workbook helps you turn reflection into a clearer story and next steps.",
    includes: ["Guided values and strengths prompts", "Audience and messaging exercises", "A one-page brand clarity summary"]
  },
  {
    id: "content-calendar",
    name: "The Content Calendar",
    category: "Templates",
    categoryKey: "templates",
    price: 7.5,
    badge: "CREATOR FAVORITE",
    theme: "art-template",
    coverTitle: "THE CONTENT<br>CALENDAR",
    kicker: "PLAN WITH PURPOSE",
    tagline: "GOOD IDEAS, WITH A PLAN.",
    shortDescription: "A flexible content planning template for your next big idea.",
    description: "Make consistency feel a little less complicated. Organize ideas, shape a realistic publishing rhythm, and keep an eye on what is coming up with this flexible planning template.",
    includes: ["Monthly content overview", "Idea bank and status tracker", "Space for notes and reflections"]
  },
  {
    id: "freelancer-toolkit",
    name: "Freelancer Starter Kit",
    category: "E-books",
    categoryKey: "e-books",
    price: 14,
    badge: "MADE FOR MAKERS",
    theme: "art-business",
    coverTitle: "FREELANCER<br>STARTER KIT",
    kicker: "INDEPENDENT WORK",
    tagline: "START SMALL. BUILD YOUR WAY.",
    shortDescription: "A friendly starting point for organizing independent work.",
    description: "Starting freelance work comes with a lot of little details. This friendly guide helps you think through your services, organize your workflow, and build a routine that suits you.",
    includes: ["Service and project planning prompts", "A simple client-workflow checklist", "Practical routines for solo work"]
  },
  {
    id: "exam-revision",
    name: "Exam Revision Notes",
    category: "Study notes",
    categoryKey: "study-notes",
    price: 5.5,
    badge: "STUDY SMARTER",
    theme: "art-code",
    coverTitle: "EXAM<br>REVISION<br>NOTES",
    kicker: "YOUR REVISION RESET",
    tagline: "REVIEW WITH A LITTLE MORE CALM.",
    shortDescription: "A tidy revision framework for organizing what you know.",
    description: "Give exam prep a clearer starting point with an adaptable system for organizing topics, noting key ideas, and deciding what to revisit next.",
    includes: ["Topic-by-topic revision pages", "Key concepts and question prompts", "Progress check-ins for your study plan"]
  }
];

const categories = [
  { label: "All products", key: "all" },
  { label: "E-books", key: "e-books" },
  { label: "Study notes", key: "study-notes" },
  { label: "Templates", key: "templates" },
  { label: "Workbooks", key: "workbooks" }
];

const productGrid = document.querySelector("#product-grid");
const categoryFilters = document.querySelector("#category-filters");
const searchInput = document.querySelector("#product-search");
const resultsCount = document.querySelector("#results-count");
const emptyResults = document.querySelector("#empty-results");
const detailsDialog = document.querySelector("#details-dialog");
const detailsContent = document.querySelector("#details-content");
const cartDialog = document.querySelector("#cart-dialog");
const cartItemsElement = document.querySelector("#cart-items");
const cartCountElement = document.querySelector("#cart-count");
const cartTotalElement = document.querySelector("#cart-total");
const cartTitleCount = document.querySelector("#cart-title-count");
const toast = document.querySelector("#toast");
const authDialog = document.querySelector("#auth-dialog");
const authTrigger = document.querySelector("#auth-trigger");
const authTriggerLabel = document.querySelector("#auth-trigger-label");
const authForm = document.querySelector("#auth-form");
const authTabs = document.querySelector("#auth-tabs");
const authNameField = document.querySelector("#auth-name-field");
const authNameInput = document.querySelector("#auth-name");
const authEmailInput = document.querySelector("#auth-email");
const authPasswordInput = document.querySelector("#auth-password");
const authPasswordHint = document.querySelector("#auth-password-hint");
const authMessage = document.querySelector("#auth-message");
const authSubmit = document.querySelector("#auth-submit");
const authAccountPanel = document.querySelector("#account-panel");
const authSignout = document.querySelector("#auth-signout");

let activeCategory = "all";
let toastTimeout;
let cart = loadCart();
let authMode = "login";
let currentUser = null;
let authAvailabilityError = location.protocol === "file:"
  ? "Start the site with start.bat (or `node server.js`) before using local accounts."
  : "";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("rohitx-store-cart") || "{}");
    if (!savedCart || typeof savedCart !== "object" || Array.isArray(savedCart)) return {};

    return Object.fromEntries(
      Object.entries(savedCart).filter(([id, quantity]) =>
        products.some((product) => product.id === id) &&
        Number.isSafeInteger(quantity) &&
        quantity > 0 &&
        quantity <= 99
      )
    );
  } catch (error) {
    console.warn("The saved cart could not be loaded.", error);
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("rohitx-store-cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("The cart could not be saved in this browser.", error);
  }
}

function productArtwork(product, extraClass = "") {
  return `
    <div class="product-art ${product.theme} ${extraClass}" aria-hidden="true">
      ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
      <div class="product-cover">
        <span class="cover-kicker">${escapeHtml(product.kicker)}</span>
        <span class="cover-title">${product.coverTitle}</span>
        <span class="cover-bottom"><span>${escapeHtml(product.tagline)}</span><span class="cover-mark">Rx</span></span>
      </div>
      ${extraClass ? "" : '<span class="quick-view">Quick view ↗</span>'}
    </div>`;
}

function renderCategories() {
  categoryFilters.innerHTML = categories.map(({ label, key }) => `
    <button class="category-chip${activeCategory === key ? " active" : ""}"
      type="button" data-category="${key}" aria-pressed="${activeCategory === key}">
      ${label}
    </button>`).join("");
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  return products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.categoryKey === activeCategory;
    const searchableText = `${product.name} ${product.category} ${product.shortDescription} ${product.description}`.toLocaleLowerCase();
    return matchesCategory && (!query || searchableText.includes(query));
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card" data-product-id="${product.id}" tabindex="0"
      aria-label="${escapeHtml(product.name)}, ${formatPrice(product.price)}. View details.">
      ${productArtwork(product)}
      <div class="product-info">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.shortDescription)}</p>
        <div class="product-meta">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">
            <span aria-hidden="true">+</span> Add to cart
          </button>
        </div>
      </div>
    </article>`).join("");

  resultsCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"}`;
  emptyResults.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function showAuthMessage(message, success = false) {
  authMessage.textContent = message;
  authMessage.classList.toggle("success", success);
  authMessage.hidden = !message;
}

function setAuthMode(mode) {
  authMode = mode;
  authNameField.hidden = mode !== "register";
  authNameInput.required = mode === "register";
  authPasswordInput.autocomplete = mode === "register" ? "new-password" : "current-password";
  authPasswordHint.textContent = mode === "register"
    ? "Use at least 12 characters. A longer passphrase is easier to remember."
    : "Use the password you chose when creating your account.";
  document.querySelector("#auth-title").textContent = mode === "register" ? "Create your account" : "Welcome back";
  document.querySelector("#auth-description").textContent = mode === "register"
    ? "Create a local account for your RohitX Store."
    : "Sign in to your local store account.";
  document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  authTabs.hidden = false;
  authForm.hidden = false;
  authAccountPanel.hidden = true;
  authSubmit.innerHTML = mode === "register"
    ? 'Create account <span aria-hidden="true">↗</span>'
    : 'Sign in <span aria-hidden="true">↗</span>';
  showAuthMessage(authAvailabilityError);
}

function showAccountPanel() {
  if (!currentUser) {
    setAuthMode(authMode);
    return;
  }

  authTabs.hidden = true;
  authForm.hidden = true;
  authAccountPanel.hidden = false;
  document.querySelector("#auth-title").textContent = "Your account";
  document.querySelector("#auth-description").textContent = "You are signed in to this local RohitX Store.";
  document.querySelector("#account-name").textContent = currentUser.name;
  document.querySelector("#account-email").textContent = currentUser.email;
  document.querySelector("#account-avatar").textContent = [...currentUser.name][0].toLocaleUpperCase();
  showAuthMessage("");
}

async function authRequest(endpoint, payload) {
  if (location.protocol === "file:") throw new Error(authAvailabilityError);

  let response;
  try {
    response = await fetch(endpoint, {
      method: payload ? "POST" : "GET",
      credentials: "same-origin",
      headers: payload ? { "Content-Type": "application/json" } : {},
      body: payload ? JSON.stringify(payload) : undefined
    });
  } catch (error) {
    console.error("Could not reach the local account server.", error);
    throw new Error("Could not reach the local account server. Start it with start.bat and try again.");
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error("The local account server returned an unreadable response.", error);
    throw new Error("The local account server returned an unexpected response. Check that it is running, then try again.");
  }

  if (!response.ok) throw new Error(result.error || "The account request could not be completed.");
  authAvailabilityError = "";
  return result;
}

function updateAuthTrigger() {
  if (currentUser) {
    const firstName = currentUser.name.trim().split(/\s+/)[0];
    authTriggerLabel.textContent = firstName;
    authTrigger.setAttribute("aria-label", `Account for ${currentUser.name}`);
  } else {
    authTriggerLabel.textContent = "Sign in";
    authTrigger.setAttribute("aria-label", "Sign in to your account");
  }
}

async function loadCurrentUser() {
  if (authAvailabilityError) return;
  try {
    const result = await authRequest("/api/auth/me");
    currentUser = result.user;
    authAvailabilityError = "";
    updateAuthTrigger();
  } catch (error) {
    authAvailabilityError = error.message;
    console.error("Could not check the local account session.", error);
  }
}

function updateCart() {
  const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  cartCountElement.textContent = String(itemCount);
  cartTitleCount.textContent = `(${itemCount})`;
  cartTotalElement.textContent = formatPrice(total);

  const cartProducts = products.filter((product) => cart[product.id]);
  if (cartProducts.length === 0) {
    cartItemsElement.innerHTML = `
      <div class="cart-empty">
        <span aria-hidden="true">✳</span>
        <h3>A little room for inspiration.</h3>
        <p>Your cart is empty. Explore the collection and add something that helps you get moving.</p>
        <button class="button button-primary" type="button" data-close-dialog>Explore products <span aria-hidden="true">↗</span></button>
      </div>`;
  } else {
    cartItemsElement.innerHTML = cartProducts.map((product) => `
      <article class="cart-item" data-cart-item="${product.id}">
        <div class="cart-thumb ${product.theme}" aria-hidden="true">
          <div class="product-cover"><span class="cover-kicker">${escapeHtml(product.kicker)}</span><span class="cover-title">${product.coverTitle}</span><span class="cover-bottom"><span>${escapeHtml(product.tagline)}</span><span class="cover-mark">Rx</span></span></div>
        </div>
        <div class="cart-item-info">
          <h3>${escapeHtml(product.name)}</h3>
          <span>${escapeHtml(product.category)}</span>
          <div class="quantity-control" aria-label="Quantity for ${escapeHtml(product.name)}">
            <button type="button" data-quantity="-1" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${cart[product.id]}</span>
            <button type="button" data-quantity="1" data-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-side"><strong>${formatPrice(product.price * cart[product.id])}</strong><button class="remove-item" type="button" data-remove="${product.id}">Remove</button></div>
      </article>`).join("");
  }
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  saveCart();
  updateCart();
  showToast(`${product.name} added to your cart`);
}

function showProductDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  detailsContent.innerHTML = `
    ${productArtwork(product, "detail-art")}
    <div class="details-copy">
      <span class="product-category">${escapeHtml(product.category)} · DIGITAL DOWNLOAD</span>
      <h2 id="details-title">${escapeHtml(product.name)}</h2>
      <p>${escapeHtml(product.description)}</p>
      <ul class="details-features">${product.includes.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
      <div class="details-buy"><strong>${formatPrice(product.price)}</strong><button class="button button-primary" type="button" data-add="${product.id}">Add to cart <span aria-hidden="true">+</span></button></div>
    </div>`;
  detailsDialog.showModal();
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    event.stopPropagation();
    addToCart(addButton.dataset.add);
    return;
  }
  const card = event.target.closest("[data-product-id]");
  if (card) showProductDetails(card.dataset.productId);
});

productGrid.addEventListener("keydown", (event) => {
  const card = event.target.closest(".product-card");
  if (card && event.target === card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    showProductDetails(card.dataset.productId);
  }
});

detailsContent.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
  detailsDialog.close();
});

cartItemsElement.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const id = quantityButton.dataset.id;
    const nextQuantity = (cart[id] || 0) + Number(quantityButton.dataset.quantity);
    if (nextQuantity <= 0) delete cart[id];
    else cart[id] = Math.min(nextQuantity, 99);
  } else if (removeButton) {
    delete cart[removeButton.dataset.remove];
  } else {
    return;
  }

  saveCart();
  updateCart();
});

document.querySelector("#cart-trigger").addEventListener("click", () => cartDialog.showModal());

authTrigger.addEventListener("click", () => {
  if (currentUser) showAccountPanel();
  else setAuthMode(authMode);
  authDialog.showModal();
});

authTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-auth-mode]");
  if (!tab || currentUser) return;
  authForm.reset();
  setAuthMode(tab.dataset.authMode);
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!authForm.reportValidity()) return;

  const formData = new FormData(authForm);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };
  if (authMode === "register") payload.name = String(formData.get("name") || "").trim();

  authSubmit.disabled = true;
  authSubmit.textContent = authMode === "register" ? "Creating account..." : "Signing in...";
  showAuthMessage("");
  try {
    const result = await authRequest(`/api/auth/${authMode}`, payload);
    currentUser = result.user;
    authAvailabilityError = "";
    updateAuthTrigger();
    authDialog.close();
    showToast(authMode === "register" ? "Your local account is ready." : `Welcome back, ${currentUser.name.split(/\s+/)[0]}.`);
  } catch (error) {
    showAuthMessage(error.message);
  } finally {
    authSubmit.disabled = false;
    authSubmit.innerHTML = authMode === "register"
      ? 'Create account <span aria-hidden="true">↗</span>'
      : 'Sign in <span aria-hidden="true">↗</span>';
  }
});

authSignout.addEventListener("click", async () => {
  authSignout.disabled = true;
  try {
    await authRequest("/api/auth/logout", {});
    currentUser = null;
    updateAuthTrigger();
    authForm.reset();
    setAuthMode("login");
    showAuthMessage("You have signed out.", true);
  } catch (error) {
    showAuthMessage(error.message);
  } finally {
    authSignout.disabled = false;
  }
});

document.addEventListener("click", (event) => {
  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) {
    const dialog = closeButton.closest("dialog");
    if (dialog?.open) dialog.close();
  }
});

for (const dialog of [detailsDialog, cartDialog, authDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

document.querySelector("#clear-filters").addEventListener("click", () => {
  activeCategory = "all";
  searchInput.value = "";
  renderCategories();
  renderProducts();
  searchInput.focus();
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#newsletter-message");
  message.textContent = "Thanks for trying the demo! No email was sent or stored.";
  message.classList.add("success");
  event.currentTarget.reset();
});

renderCategories();
renderProducts();
updateCart();
setAuthMode("login");
updateAuthTrigger();
loadCurrentUser();