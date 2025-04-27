import { supabase } from '../supabase.js';

// Vérification régulière de la session toutes les 5 minutes
setInterval(async function() {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.user) {
    console.log("La session a expiré.");
    alert("Votre session a expiré. Veuillez vous reconnecter.");
    window.location.href = "adm_login.html";
  }
}, 5 * 60 * 1000); // Vérification toutes les 5 minutes

const ingredientContainer = document.getElementById("ingredients");
const stepsContainer = document.getElementById("steps");
let cachedUnits = [];

// Récupérer les unités via fetch
async function getUnits() {
  console.log("Tentative de récupération des unités...");
  try {
    const response = await fetch("https://faalxpglzjelaijyubis.supabase.co/rest/v1/Units?select=*",
    {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWx4cGdsemplbGFpanl1YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTQ2MTEsImV4cCI6MjA2MDczMDYxMX0.AeTrJnHT8taozCdxmEN2tiR0d2Erm_skbMOPXRe01nc",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWx4cGdsemplbGFpanl1YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTQ2MTEsImV4cCI6MjA2MDczMDYxMX0.AeTrJnHT8taozCdxmEN2tiR0d2Erm_skbMOPXRe01nc`,
      }
    });

    if (!response.ok) {
      // Affiche plus de détails sur l'erreur
      const errorDetails = await response.text();
      console.error("Erreur lors de la récupération des unités : ", response.statusText, errorDetails);
      throw new Error(`Erreur de la requête : ${response.statusText} (Code ${response.status})`);
    }

    const data = await response.json();
    console.log("Unité récupérées :", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des unités :", error);
    alert("Une erreur est survenue lors de la récupération des unités.");
    return [];
  }
}


// Fonction pour créer un ingrédient
function createIngredientInput(units) {
  const div = document.createElement("div");
  div.classList.add("item");

  const name = document.createElement("input");
  name.type = "text";
  name.placeholder = "Nom";
  name.required = true;
  name.setAttribute("list", "ingredients-list");

  const qty = document.createElement("input");
  qty.placeholder = "Quantité";
  qty.type = "number";
  qty.required = true;

  const unitSelect = document.createElement("select");
  unitSelect.required = true;

  units.forEach(u => {
    const option = document.createElement("option");
    option.value = u.id;
    option.textContent = `${u.name} (${u.symbol})`; // Affichage du nom et du symbole de l'unité
    unitSelect.appendChild(option);
  });

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.textContent = "❌";
  delBtn.onclick = () => div.remove();

  div.append(name, qty, unitSelect, delBtn);
  return div;
}

window.addIngredient = async function () {
  console.log("Ajout d'un ingrédient...");
  if (cachedUnits.length === 0) {
    try {
      cachedUnits = await getUnits();
      console.log("Unité chargées:", cachedUnits); // Vérification après chargement des unités
    } catch (err) {
      console.error("Erreur récupération unités :", err);
      return;
    }
  }

  const input = createIngredientInput(cachedUnits);
  ingredientContainer.appendChild(input);
};

window.addStep = function () {
  console.log("Ajout d'une étape...");
  const div = document.createElement("div");
  div.classList.add("item");

  const stepInput = document.createElement("input");
  stepInput.placeholder = "Étape...";
  stepInput.required = true;

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.textContent = "❌";
  delBtn.onclick = () => div.remove();

  div.append(stepInput, delBtn);
  stepsContainer.appendChild(div);
};

document.getElementById("recipe-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted!");

  const title = e.target.title.value;
  const preparation_time = parseInt(e.target.preparation_time.value);
  const difficulty = parseInt(e.target.difficulty.value);
  const imageFile = document.getElementById("image-upload").files[0];

  // 1. Ajouter la recette
  const { data: recipeData, error: recipeError } = await supabase
    .from('Recipes')
    .insert([{ title, preparation_time, difficulty }])
    .select()
    .single();

  if (recipeError) return alert("Erreur recette : " + recipeError.message);

  const recipeId = recipeData.id;

  // 2. Upload image si présente
  if (imageFile) {
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(`recipes/${Date.now()}_${imageFile.name}`, imageFile);

    if (error) {
      console.error("Erreur image :", error);
    } else {
      await supabase.from('Recipes_images').insert([{
        recipe_id: recipeId,
        image_url: data.path
      }]);
    }
  }

  // 3. Ajouter ingrédients
  for (const div of ingredientContainer.children) {
    const [name, qty, unit] = div.querySelectorAll("input, select");
    await supabase.from('Ingredients').insert([{
      name: name.value,
      quantity: parseFloat(qty.value),
      unit_id: unit.value,
      recipe_id: recipeId
    }]);
  }

  // 4. Ajouter étapes
  for (const [index, div] of [...stepsContainer.children].entries()) {
    const input = div.querySelector("input");
    await supabase.from('Steps').insert([{
      description: input.value,
      step_number: index + 1,
      recipe_id: recipeId
    }]);
  }

  alert("Recette ajoutée avec succès !");
  location.reload();
});

// Auto-ajoute un ingrédient et une étape au chargement
window.addEventListener("DOMContentLoaded", async () => {
  console.log("Chargement de la page...");
  try {
    cachedUnits = await getUnits();
    addIngredient();
    addStep();
  } catch (err) {
    console.error("Erreur chargement initial :", err);
  }
});
