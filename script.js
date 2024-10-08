
const apiEndpoint = "https://www.themealdb.com/api/json/v1/1/random.php";
const searchEndpoint = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const numMeals = 42;

async function getRandomMeals() {
  const mealcontainer = document.getElementById("meal-container");
  mealcontainer.innerHTML = ''; 
  for (let i = 0; i < numMeals; i++) {
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      const meal = data.meals[0];
      
      mealcontainer.innerHTML += createMealCard(meal);
    } catch (error) {
      console.error(error);
    }
  }
}

async function searchMeals() {
  const searchInput = document.getElementById("mealSearch").value;
  const mealcontainer = document.getElementById("meal-container");
  mealcontainer.innerHTML = ''; 

  if (searchInput.trim() === "") {
    getRandomMeals();
    return;
  }

  try {
    const res = await fetch(`${searchEndpoint}${searchInput}`);
    const data = await res.json();

    if (data.meals) {
      data.meals.forEach((meal) => {
        mealcontainer.innerHTML += createMealCard(meal);
      });
    } else {
      mealcontainer.innerHTML = '<p>No meals found. Try a different search term!</p>';
    }
  } catch (error) {
    console.error(error);
  }
}

function createMealCard(meal) {
  return `
    <div class="col-md-3 mb-3 meal-item">
      <div class="card" onclick="openMealModal(${meal.idMeal})">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="Meal Image">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
        </div>
      </div>
    </div>
  `;
}

async function openMealModal(mealId) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await res.json();
  const meal = data.meals[0];

  let youtubeUrl = meal.strYoutube;
  let youtubeEmbedUrl = '';
  if (youtubeUrl) {
    const videoId = youtubeUrl.split('v=')[1]; 
    youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`; 
  }

  
  const modalContent = `
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">${meal.strMeal}</h5>
    </div>
    <div class="modal-body">
      <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
      <h6>Ingredients:</h6>
      <ul>
        ${getIngredientsList(meal)}
      </ul>
      <h6>Instructions:</h6>
      <p>${meal.strInstructions}</p>

      <!-- YouTube Video Section -->
      ${youtubeEmbedUrl ? `
        <h6>Watch How to Prepare:</h6>
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" src="${youtubeEmbedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
      ` : `<p>No video available for this meal.</p>`}
    </div>
  </div>
`;
  
  document.getElementById("mealModalContent").innerHTML = modalContent;
  $('#mealModal').modal('show');
}

function getIngredientsList(meal) {
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const ingredientImageUrl = `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`; 
      ingredients += `  <img src="${ingredientImageUrl}" alt="${ingredient}" style="width: 50px; height: 50px; margin-right: 10px;"> <!-- Bigger size -->
          ${ingredient} - ${measure}`
    }
  }
  return ingredients;
}
document.getElementById("searchBtn").addEventListener("click", searchMeals);
document.getElementById("randomBtn").addEventListener("click", getRandomMeals);

getRandomMeals();
