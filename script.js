const STORAGE_KEY = "ai-efficiency-studio-requests";

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
const requestRecords = document.querySelector("#requestRecords");
const emptyState = document.querySelector("#emptyState");
const clearDemoDataButton = document.querySelector("#clearDemoData");
const memoryStore = {};

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

const getRequests = () => {
  try {
    const source = window.localStorage?.getItem(STORAGE_KEY) || memoryStore[STORAGE_KEY] || "[]";
    return JSON.parse(source) || [];
  } catch (error) {
    return [];
  }
};

const saveRequests = (records) => {
  const payload = JSON.stringify(records);
  memoryStore[STORAGE_KEY] = payload;
  try {
    window.localStorage?.setItem(STORAGE_KEY, payload);
  } catch (error) {
    memoryStore[STORAGE_KEY] = payload;
  }
};

const clearRequests = () => {
  delete memoryStore[STORAGE_KEY];
  try {
    window.localStorage?.removeItem(STORAGE_KEY);
  } catch (error) {
    delete memoryStore[STORAGE_KEY];
  }
};

const escapeHTML = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatTime = (isoString) => {
  if (!isoString) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
};

const applySelectedPlan = (plan) => {
  if (!selectedPlanInput || !plan) return;
  selectedPlanInput.value = plan;
  showFormMessage(`已选择 ${plan} 套餐，请填写需求信息`);
};

const updateText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const updateProgress = (id, percentId, value) => {
  const bar = document.querySelector(id);
  const label = document.querySelector(percentId);
  const percent = `${value}%`;
  if (bar) bar.style.width = percent;
  if (label) label.textContent = percent;
};

const renderAdmin = () => {
  if (!requestRecords) return;

  const records = getRequests();
  const today = new Date().toDateString();
  const todayCount = records.filter((record) => new Date(record.createdAt).toDateString() === today).length;
  const pendingCount = records.filter((record) => record.status !== "已完成").length;
  const completedCount = records.filter((record) => record.status === "已完成").length;

  updateText("#todayCount", todayCount);
  updateText("#pendingCount", pendingCount);
  updateText("#completedCount", completedCount);

  const total = records.length || 1;
  const basicPercent = Math.round((records.filter((record) => record.selectedPlan === "Basic Plan").length / total) * 100);
  const proPercent = Math.round((records.filter((record) => record.selectedPlan === "Pro Plan").length / total) * 100);
  const businessPercent = Math.round((records.filter((record) => record.selectedPlan === "Business Plan").length / total) * 100);

  updateProgress("#basicProgress", "#basicPercent", records.length ? basicPercent : 0);
  updateProgress("#proProgress", "#proPercent", records.length ? proPercent : 0);
  updateProgress("#businessProgress", "#businessPercent", records.length ? businessPercent : 0);

  requestRecords.innerHTML = records
    .map(
      (record) => `
        <tr>
          <td>${escapeHTML(formatTime(record.createdAt))}</td>
          <td>${escapeHTML(record.name)}</td>
          <td>${escapeHTML(record.contact)}</td>
          <td>${escapeHTML(record.requestType)}</td>
          <td>${escapeHTML(record.budget)}</td>
          <td>${escapeHTML(record.selectedPlan)}</td>
          <td>${escapeHTML(record.notes)}</td>
        </tr>
      `,
    )
    .join("");

  if (emptyState) {
    emptyState.hidden = records.length > 0;
  }
};

scrollButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const target = button.dataset.scrollTarget;
    if (!target) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (currentPage !== "index.html" && target !== "request") return;

    event.preventDefault();
    scrollToSection(target);
  });
});

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!modal || !modalTitle || !modalText) {
      window.location.href = "product.html";
      return;
    }
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

    const formData = {
      name: document.querySelector("#name")?.value.trim() || "",
      contact: document.querySelector("#contact")?.value.trim() || "",
      requestType: document.querySelector("#requestType")?.value.trim() || "",
      budget: document.querySelector("#budget")?.value.trim() || "",
      selectedPlan: selectedPlanInput?.value.trim() || "",
      notes: document.querySelector("#notes")?.value.trim() || "",
    };

    if (Object.values(formData).some((value) => !value)) {
      showFormMessage("请补全姓名、联系方式、需求类型、预算、套餐和备注", "error");
      return;
    }

    const record = {
      id: `REQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "待处理",
      ...formData,
    };

    saveRequests([record, ...getRequests()]);
    requestForm.reset();
    showFormMessage("提交成功，我们会尽快联系你");
  });
}

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const icon = button.querySelector("span");
    if (!item || !icon) return;

    const isOpen = item.classList.toggle("open");
    icon.textContent = isOpen ? "-" : "+";
  });
});

if (clearDemoDataButton) {
  clearDemoDataButton.addEventListener("click", () => {
    clearRequests();
    renderAdmin();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
});

renderAdmin();
