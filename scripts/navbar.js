const menu_btn = document.querySelector(".burger_menu");
const navbar = document.querySelector(".navbar");

menu_btn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});


document.addEventListener("click", function (event) {
    if (!menu_btn.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove("active");
    }
});