document.addEventListener("DOMContentLoaded", function () {
    const onOrderItems = document.querySelectorAll(".product.on_order");

    onOrderItems.forEach(item => {
        const banner = document.createElement("div");
        banner.classList.add("order-banner");
        banner.textContent = "Sur commande";

        const title = item.querySelector("h2");
        const image = item.querySelector("img");

        // Insère la banderole juste avant l'image
        if (title && image) {
            image.parentNode.insertBefore(banner, image);
        }
    });
});