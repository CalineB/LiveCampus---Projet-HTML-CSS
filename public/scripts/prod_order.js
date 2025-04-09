document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".products");
    const products = Array.from(productList.querySelectorAll(".product"));

    // Trie par ordre alphabétique des noms de produits
    products.sort((a, b) => {
      const nameA = a.querySelector(".prod_name").textContent.trim().toLowerCase();
      const nameB = b.querySelector(".prod_name").textContent.trim().toLowerCase();
      return nameA.localeCompare(nameB, 'fr'); // Tri avec locale française
    });

    // Réinsère les éléments dans le bon ordre
    products.forEach(product => productList.appendChild(product));
  });