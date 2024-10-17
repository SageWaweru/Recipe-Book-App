function handleclick() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
}

const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const numberOfRecipes = 4;
const allIngredients = ["spaghetti", "chicken"];

const getRandomIngredients = (numIngredients = 1) => {
  const shuffled = allIngredients.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numIngredients).join(",");
};

const displayRecipes = (recipes) => {
  const recipeContainer = document.getElementById("recipeList");
  recipeContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" aria-label="Recipe image of ${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
            <button class="preview-btn" onclick="viewRecipe('${recipe.idMeal}')" aria-label="Preview recipe: ${recipe.strMeal}">View Recipe</button>
        `;

    recipeContainer.appendChild(recipeCard);
  });
};

const fetchData = () => {
  const ingredients = getRandomIngredients();
  console.log(`Fetching recipes for ingredients: ${ingredients}`);

  fetch(`${API_URL}${ingredients}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.meals) {
        displayRecipes(data.meals);
      } else {
        console.error("No recipes found for the ingredients");
        document.getElementById("recipeList").innerHTML =
          "<p>No recipes found.</p>";
      }
    })
    .catch((error) => {
      console.error("There is a problem fetching data", error);
    });
};

fetchData();

function viewRecipe(idMeal) {
  sessionStorage.setItem("recipeId", idMeal);
  window.location.href = "fullview.html";
}

function handleSearch() {
  event.preventDefault();

  const searchQuery = document.querySelector(".search-space").value;

  if (!searchQuery) {
    alert("Please enter an ingredient to search.");
    return;
  }

  fetch(`${API_URL}${searchQuery}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.meals) {
        displayRecipes(data.meals);
      } else {
        console.error("No recipes found for the ingredients");
        document.getElementById("recipeList").innerHTML =
          "<p>No recipes found.</p>";
      }
    })
    .catch((error) => {
      console.error("There is a problem fetching data", error);
    });
}

function loadRecipeDetails() {
  const recipeId = sessionStorage.getItem("recipeId");
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
    .then((response) => response.json())
    .then((data) => {
      const recipe = data.meals[0];
      document.getElementById("recipeContainer").innerHTML = `
                
                <div>
                  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <p><strong>Category:</strong> ${recipe.strCategory}</p>
                </div>
                <h2>${recipe.strMeal}</h2>
                <div>
                    <h4><strong>Instructions: </strong> <br>${recipe.strInstructions}</h4>
                </div>
                <div class="v-btn">
                <button id="watchBtn" href="${recipe.strYoutube}" target="_blank">Watch Recipe Video</a></button>
                <button id="saveBtn" onclick="saveRecipe(${recipe.idMeal})"aria-label="Save recipe: ${recipe.strMeal}">Save Recipe</button>
                </div>

            `;
    })
    .catch((error) => console.error("Error fetching recipe details:", error));
}
loadRecipeDetails();

const ingredients = [
  "apples",
  "flour",
  "sugar",
  "spaghetti",
  "butter",
  "milk",
  "eggs",
  "chicken",
  "cheese",
  "tomatoes",
  "potatoes",
  "onions",
  "garlic",
];

const getIngredients = (number = 1) => {
  const random = ingredients.sort(() => 0.5 - Math.random());
  return random.slice(0, number).join(",");
};

const showRecipes = (recipes) => {
  const container = document.getElementById("RecipeContainer");
  container.innerHTML = "";

  recipes.forEach((recipe) => {
    const Card = document.createElement("div");
    Card.classList.add("card");

    Card.innerHTML = `
            <div>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" aria-label="Recipe image of ${recipe.strMeal}">
            </div>
            <div>
            <h3>${recipe.strMeal}</h3>
            </div>
            <button class="preview-btn" onclick="viewRecipe('${recipe.idMeal}')" aria-label="Preview recipe: ${recipe.strMeal}">View Recipe</button>
        `;

    container.appendChild(Card);
  });
};

const getData = () => {
  i = getIngredients();

  fetch(`${API_URL}${i}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.meals) {
        showRecipes(data.meals);
      } else {
        console.error("No recipes found for the ingredients");
        document.getElementById("RecipeContainer").innerHTML =
          "<p>No recipes found.</p>";
      }
    })
    .catch((error) => {
      console.error("There is a problem fetching data", error);
    });
};
getData();

function saveRecipe(idMeal) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response Data:", data);

      if (!data.meals || data.meals.length === 0) {
        alert("Recipe not found.");
        console.error("Recipe not found.");
        return;
      }

      const recipe = data.meals[0];
      console.log("Recipe fetched:", recipe);

      let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

      const recipeExists = savedRecipes.some(
        (savedRecipe) => savedRecipe.idMeal === recipe.idMeal
      );
      console.log("Recipe exists in saved list?", recipeExists); // Debugging log

      if (!recipeExists) {
        savedRecipes.push(recipe);

        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));

        alert(`${recipe.strMeal} has been saved!`);
      } else {
        alert(`${recipe.strMeal} is already saved.`);
      }
    })
    .catch((error) => {
      console.error("Error saving recipe:", error);
      alert("An error occurred while saving the recipe.");
    });
}

function displaySavedRecipes() {
  const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  const savedRecipesContainer = document.getElementById(
    "savedRecipesContainer"
  );

  savedRecipesContainer.innerHTML = "";
  if (savedRecipes.length === 0) {
    savedRecipesContainer.innerHTML = "<p>No saved recipes yet.</p>";
    return;
  }

  savedRecipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("saved-recipe");

    recipeCard.innerHTML = `
            <div>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" aria-label="Recipe image of ${recipe.strMeal}">
            </div>
            <div id="tittle">
                <h3>${recipe.strMeal}</h3>
            </div>
            <div class="save-btns">
                <button class="remove-btn" onclick="removeSavedRecipe('${recipe.idMeal}')" aria-label="Remove recipe: ${recipe.strMeal}">Remove</button>
                <button onclick="viewRecipe('${recipe.idMeal}')" aria-label="View recipe: ${recipe.strMeal}">View Recipe</button>
            </div>
        `;

    savedRecipesContainer.appendChild(recipeCard);
  });
}

displaySavedRecipes();
function removeSavedRecipe(idMeal) {
  let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

  savedRecipes = savedRecipes.filter((recipe) => recipe.idMeal !== idMeal);

  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));

  displaySavedRecipes();
}
