// On récupère les éléments ciblés dans des variables.
const menu_btn = document.querySelector(".burger_menu");
const navbar = document.querySelector(".navbar");

// On ajoute un écouteur d'évènement sur l'icon via sa class récupéré dans la variable.
menu_btn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});

// On ferme le menu si on click en dehors du menu ou de la navbar
document.addEventListener("click", function (event) {
    if (!menu_btn.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove("active");
    }
});


// Pour aller sur la page correspondante, nos "li", sont aussi des liens vers les pages "a href".