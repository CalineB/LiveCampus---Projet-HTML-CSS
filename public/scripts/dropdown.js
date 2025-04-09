// On récupère les éléments ciblés dans des variables.
const dropdown = document.querySelector(".dropdown");
const dropdownText = dropdown.querySelector(".dropdown-text");
const categories = document.querySelector(".categories");
const categoryItems = document.querySelectorAll(".categories li");
const products = document.querySelectorAll(".product");

// On cherche l'élément sélectionné dans la liste au chargement
const selectedItem = document.querySelector(".categories .selected");
if (selectedItem && dropdownText) {
    dropdownText.textContent = selectedItem.textContent;
}

// Au clic sur la div qui regroupe la liste du menu
// la classe active s'ajoute et la flèche tourne
dropdown.addEventListener("click", function () {
    categories.classList.toggle("active");
    dropdown.classList.toggle("open"); // la flèche tourne ici
});

// Lorsqu'un élément de la catégorie est sélectionné, on met à jour le texte du dropdown et on filtre les produits
categoryItems.forEach(item => {
    item.addEventListener("click", function () {
        // Mettre à jour le texte dans le dropdown
        if (dropdownText) {
            dropdownText.textContent = this.textContent;
        }

        // Fermeture du menu et remise à zéro de la flèche
        categories.classList.remove("active");
        dropdown.classList.remove("open");

        // Récupérer la catégorie sélectionnée
        const selectedCategory = this.classList[1];

        // Filtrer les produits en fonction de la catégorie sélectionnée
        products.forEach(product => {
            if (product.classList.contains(selectedCategory) || selectedCategory === "all") {
                product.style.display = "flex";
            } else {
                product.style.display = "none";
            }
        });

        // Ajouter la classe "selected" à la catégorie cliquée
        categoryItems.forEach(item => item.classList.remove("selected"));
        this.classList.add("selected");
    });
});

// Si on clique en dehors du menu déroulant, il se referme sans modifier les produits affichés.
document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target) && !categories.contains(event.target)) {
        categories.classList.remove("active");
        dropdown.classList.remove("open");
    }
});
