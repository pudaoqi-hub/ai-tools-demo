const tryButton = document.querySelector("#tryButton");
const buyButtons = document.querySelectorAll(".buy-button");

tryButton.addEventListener("click", () => {
  document.querySelector("#tools").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("Demo 网站，暂未接入支付");
  });
});
