let scrollUp = document.querySelector(".scroll_up");
window.addEventListener("scroll", function () {
  if(window.scrollY > 200){
    scrollUp.style.display = "block";
  } else {
    scrollUp.style.display = "none";
  }
});

scrollUp.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


const searchInput = document.getElementById("searchInput");
const exerciseCards = document.querySelectorAll(".exercise-card");
const noResults = document.getElementById("noResults");

searchInput.addEventListener("input", function () {

    const searchValue = this.value.trim().toLowerCase();
    let found = false;

    exerciseCards.forEach(card => {
        const text = card.textContent.toLowerCase();

        if (text.includes(searchValue)) {
            card.style.display = "flex";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    noResults.style.display = found ? "none" : "block";
});