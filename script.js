const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const detailButtons = document.querySelectorAll(".detail-button");
const planButtons = document.querySelectorAll(".buy-button[data-plan]");
const planLinks = document.querySelectorAll("[data-plan-link]");
const faqQuestions = document.querySelectorAll(".faq-question");
const requestForm = document.querySelector("#requestForm");
const formMessage = document.querySelector("#formMessage");
const selectedPlanInput = document.querySelector("#selectedPlan");
const modal = document.querySelector("#productModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");

const scrollToSection = (id) => {
  const section = document.querySelector(`#${id}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const showFormMessage = (message, type = "success") => {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
};

const applySelectedPlan = (plan) => {
  if (!selectedPlanInput || !plan) return;
  selectedPlanInput.value = plan;
  showFormMessage(`已选择 ${plan} 套餐，请填写需求信息`);
};

scrollButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(button.dataset.scrollTarget);
  });
});

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!modal || !modalTitle || !modalText) return;
    modalTitle.textContent = button.dataset.product;
    modalText.textContent = button.dataset.detail;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
});

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applySelectedPlan(button.dataset.plan);
    scrollToSection("request");
  });
});

planLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const plan = encodeURIComponent(link.dataset.planLink);
    window.location.href = `index.html?plan=${plan}#request`;
  });
});

if (selectedPlanInput) {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  if (plan) {
    applySelectedPlan(plan);
    window.setTimeout(() => scrollToSection("request"), 150);
  }
}

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nickname = document.querySelector("#nickname").value.trim();
    const selectedPlan = selectedPlanInput.value.trim();
    const requestType = document.querySelector("#requestType").value.trim();
    const requestDetail = document.querySelector("#requestDetail").value.trim();

    if (!nickname || !selectedPlan || !requestType || !requestDetail) {
      showFormMessage("请补全昵称、套餐、需求类型和需求说明", "error");
      return;
    }

    window.location.href = "success.html";
  });
}

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("open");
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
});
