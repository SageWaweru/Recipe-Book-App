
function saveRecipe() {
    
    if (!savedRecipes.some((r) => r.id === currentRecipe.id)) {
        savedRecipes.push(currentRecipe);
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        alert("Recipe saved!");
        showSavedRecipes();
    } else {
        alert("Recipe is already saved.");
    }
}
// Show saved recipes
function showSavedRecipes() {
    const savedRecipesContainer = document.getElementById('savedrecipes');
    
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipesList.innerHTML = "";
    savedRecipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="removeRecipe(${recipe.id})">Remove Recipe</button>
        `;
        savedRecipesList.appendChild(recipeCard);
    });
}