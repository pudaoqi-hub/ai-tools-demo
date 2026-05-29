const tryButton = document.querySelector("#tryButton");

tryButton.addEventListener("click", () => {
  document.querySelector("#tools").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
