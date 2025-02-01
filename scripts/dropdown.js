// On récupère les éléments ciblés dans des variables.
const dropdown = document.querySelector(".dropdown");
const categories = document.querySelector(".categories");
const categoryItems = document.querySelectorAll(".categories li");
const products = document.querySelectorAll(".product");

// On cherche tous les éléments de notre liste déroulante.
const selectedItem = document.querySelector(".categories .selected");
if (selectedItem) {
    dropdown.textContent = selectedItem.textContent;
}

// Au clic sur la div qui regoupe la liste du menu
// la classe active s'ajoute.
dropdown.addEventListener("click", function () {
    categories.classList.toggle("active");
});

// Pour chaque éléments de la classe categorie, 
// on ajoute un écouteur d'évènement afin qu'au clic
//  d'un d'entre eux la classe active se retire et le menu se ferme.
categoryItems.forEach(item => {
    item.addEventListener("click", function () {
        dropdown.textContent = this.textContent;
        categories.classList.remove("active");
    });
});

// Pour chaque élément du menu déroulant
categoryItems.forEach(item => {
    item.addEventListener("click", function () {
        // On récupère la 2em class
        // afin de le lier à la class correspondante aux produits
        const selectedCategory = this.classList[1];
        dropdown.textContent = this.textContent;

        // Pour chaque produit, on vérifie s'il appartient à une class spécifique ou la class commune à tous (all)
        // Et on affiche les produits ayant la class sélectionné dans le menu
        // Ou on n'affiche rien si on n'a pas de produits correspondant à l'élément dans le menu déroulant
        products.forEach(product => {
            if (product.classList.contains(selectedCategory) || selectedCategory === "all") {
                product.style.display = "list-item";
            } else {
                product.style.display = "none";
            }
        });
    });
});

// Si on clic en dehors du menu déroulant ou pas sur un de ses éléments "li"
// lorsqu'il est ouvert, il se referme et 
// on ne change rien aux produits affichés.
document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target) && !categories.contains(event.target)) {
        categories.classList.remove("active");
    }
});