const dropdown = document.querySelector(".dropdown");
const categories = document.querySelector(".categories");
const categoryItems = document.querySelectorAll(".categories li");
const products = document.querySelectorAll(".product");


const selectedItem = document.querySelector(".categories .selected");
if (selectedItem) {
    dropdown.textContent = selectedItem.textContent;
}

dropdown.addEventListener("click", function () {
    categories.classList.toggle("active");
});

categoryItems.forEach(item => {
    item.addEventListener("click", function () {
        dropdown.textContent = this.textContent;
        categories.classList.remove("active");
    });
});

categoryItems.forEach(item => {
    item.addEventListener("click", function () {
        const selectedCategory = this.classList[1];
        dropdown.textContent = this.textContent;

        products.forEach(product => {
            if (product.classList.contains(selectedCategory) || selectedCategory === "all") {
                product.style.display = "list-item";
            } else {
                product.style.display = "none";
            }
        });
    });
});

document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target) && !categories.contains(event.target)) {
        categories.classList.remove("active");
    }
});