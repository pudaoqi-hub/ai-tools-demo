const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const detailButtons = document.querySelectorAll(".detail-button");
const planButtons = document.querySelectorAll(".buy-button");
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

scrollButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(button.dataset.scrollTarget);
  });
});

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.product;
    modalText.textContent = button.dataset.detail;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
});

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const plan = button.dataset.plan;
    selectedPlanInput.value = plan;
    formMessage.textContent = `已选择 ${plan} 套餐，请填写需求信息`;
    formMessage.className = "form-message success";
    scrollToSection("request");
  });
});

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickname = document.querySelector("#nickname").value.trim();
  const selectedPlan = selectedPlanInput.value.trim();
  const requestType = document.querySelector("#requestType").value.trim();
  const requestDetail = document.querySelector("#requestDetail").value.trim();

  if (!nickname || !selectedPlan || !requestType || !requestDetail) {
    formMessage.textContent = "请补全昵称、套餐、需求类型和需求说明";
    formMessage.className = "form-message error";
    return;
  }

  formMessage.textContent = "提交成功！这是 Demo 表单，暂未接入真实后台。";
  formMessage.className = "form-message success";
});

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("open");
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
});
