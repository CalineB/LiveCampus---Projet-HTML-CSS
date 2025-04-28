const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        const name = product.querySelector(".prod_name").textContent.toLowerCase();
        if (name.includes(query)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
});
