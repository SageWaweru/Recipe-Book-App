const API_KEY = " 9d25b92e69c240448651d9e7181ab286";
const numberOfRecipes = 4;
const allIngredients = ["apples", "flour", "sugar","spaghetti", "butter", "milk", "eggs", "chicken", "cheese", "tomatoes", "potatoes", "onions", "garlic"];
const getRandomIngredients = (numIngredients= 4) => {
    const shuffled = allIngredients.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numIngredients).join(",+"); 
};

const displayRecipes = (recipes) => {
    const recipeContainer = document.getElementById('recipeList');
    
    recipeContainer.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong> ${recipe.usedIngredients.map(ing => ing.name).join(', ')}</p>
            <p><strong>Missing Ingredients:</strong> ${recipe.missedIngredients.map(ing => ing.name).join(', ')}</p>
            <button class="preview-btn" onclick="viewRecipe(${recipe.id})">View Recipe</button>

        `;
        
        recipeContainer.appendChild(recipeCard);
    });
};

const fetchData = () => {
    const ingredients = getRandomIngredients(); 
    console.log(`Fetching recipes for ingredients: ${ingredients}`);
    
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${numberOfRecipes}&apiKey=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        })
        .then(data => {
            displayRecipes(data);  
        })
        .catch(error => {
            console.error("There is a problem fetching data", error);
        });
};
fetchData();

const recipeNumber = 10;
const ingredientList = ["apples", "flour", "sugar","spaghetti", "butter", "milk", "eggs", "chicken", "cheese", "tomatoes", "potatoes", "onions", "garlic"];
const getingredients = (ingredientNumber= 3) => {
    const shuffled = allIngredients.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, ingredientNumber).join(",+"); 
};

const recipePreview = (recipes) => {
    const container = document.getElementById('recipeContainer');
    
    container.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-preview');
        
        recipeCard.innerHTML = `
            <div><img src="${recipe.image}" alt="${recipe.title}"></div>
            <div>
                <h3>${recipe.title}</h3>
            </div>
            <div>
                <p><strong>Ingredients:</strong> ${recipe.usedIngredients.map(ing => ing.name).join(', ')}</p>
            </div>
            <div>
                <p><strong>Missing Ingredients:</strong> ${recipe.missedIngredients.map(ing => ing.name).join(', ')}</p>
            </div>
            <div><button class="r-btn" onclick="viewRecipe(${recipe.id})">View Recipe</button></div>
            <div><button class="save-btn" onclick="saveRecipe(${recipe.id})">Save Recipe</button></div>

        `;
        
        container.appendChild(recipeCard);
    });
};

const getData = () => {
    const Ingredients = getingredients(); 
    console.log(`Fetching recipes for ingredients: ${Ingredients}`);
    
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${Ingredients}&number=${recipeNumber}&apiKey=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        })
        .then(data => {
            recipePreview(data);  
        })
        .catch(error => {
            console.error("There is a problem fetching data", error);
        });
};
getData();

function viewRecipe(id) {
        sessionStorage.setItem('recipeId', id);
        window.location.href = 'recipe.html';
    }
function saveRecipe(id) {
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(recipe => {
            let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

            const recipeExists = savedRecipes.some(savedRecipe => savedRecipe.id === recipe.id);
            if (!recipeExists) {
                savedRecipes.push(recipe);

                localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

                alert(`${recipe.title} has been saved!`);
            } else {
                alert(`${recipe.title} is already saved.`);
            }
        })
        .catch(error => console.error("Error saving recipe:", error));
}

function loadSavedRecipes() {
    const savedRecipesContainer = document.getElementById('savedRecipesContainer');
    
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = '<p>No saved recipes yet.</p>';
        return;
    }

    savedRecipesContainer.innerHTML = ''; 

    savedRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('saved-recipe');
        
        recipeCard.innerHTML = `
            <div><img src="${recipe.image}" alt="${recipe.title}"></div>
            <div>
                <h3>${recipe.title}</h3>
            </div>
            <div>
                <p><strong>Ingredients:</strong> ${recipe.extendedIngredients.map(ing => ing.name).join(', ')}</p>
            </div >
             <div class="save-btns">
             <button class="remove-btn" onclick="removeRecipe(${recipe.id})">Remove</button>
             <button  id="s-preview"onclick="viewRecipe(${recipe.id})">View Recipe</button>
             </div>

        `;
        
        savedRecipesContainer.appendChild(recipeCard);
    });
}

function removeRecipe(id) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

    savedRecipes = savedRecipes.filter(recipe => recipe.id !== id);

    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

    loadSavedRecipes();
}

loadSavedRecipes();

