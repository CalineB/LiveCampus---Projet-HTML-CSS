import { supabase } from '../supabase.js';

const ingredientContainer = document.getElementById("ingredients");
const stepsContainer = document.getElementById("steps");


// Fonction pour récupérer les unités de mesure
async function getUnits() {
    const { data, error } = await supabase.from('Units').select('*');
    if (error) {
      console.error("Erreur lors de la récupération des unités : ", error);
      return [];
    }
    // console.log("Réponse Units :", { data, error });
    return data; // Retourne la liste des unités de mesure
  }

function createIngredientInput(units) {
    const div = document.createElement("div");
    div.classList.add("item");
  
    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Nom";
    name.required = true;
    name.setAttribute("list", "ingredients-list"); // Pour l'autocomplétion !
  
    const qty = document.createElement("input");
    qty.placeholder = "Quantité";
    qty.type = "number";
    qty.required = true;
  
    const unitSelect = document.createElement("select");
    unitSelect.required = true;

    units.forEach(u => {
      const option = document.createElement("option");
      option.value = u.id;
      option.textContent = u.name;
      unitSelect.appendChild(option);
    });
  
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "❌";
    delBtn.onclick = () => div.remove();
  
    div.append(name, qty, unitSelect, delBtn);
    return div;
  }

  window.addIngredient = function () {
  getUnits().then(units => {
    const input = createIngredientInput(units);
    ingredientContainer.appendChild(input);
  });
}

window.addStep = function () {
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
}

document.getElementById("recipe-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted !");


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
      console.log("Image upload result:", data, error);

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
window.addEventListener("DOMContentLoaded", () => {
  loadIngredientsList(); 
  addIngredient();
  addStep();
});


// Rechercher les ingrédients dans la base de données pour les suggérer

async function loadIngredientsList() {
    const { data, error } = await supabase.from('Ingredients').select('name').limit(1000);
    if (error) return console.error("Erreur chargement ingrédients :", error);
  
    const list = document.getElementById("ingredients-list");
    list.innerHTML = ''; // reset
  
    const uniqueNames = [...new Set(data.map(item => item.name))]; // éviter les doublons
  
    for (const name of uniqueNames) {
      const option = document.createElement("option");
      option.value = name;
      list.appendChild(option);
    }
  }
  