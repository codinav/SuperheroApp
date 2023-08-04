const publicKey = '7099391f3b2a229b2361d932e2cc1331';
const privateKey = '826ab870a9d658e09f5e8f627f89ad360e6adfdb';
const baseURL = 'https://gateway.marvel.com/v1/public/characters';
const favoritesKey = 'favoriteSuperheroes';
let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

// Function to generate the hash value
function generateHash() {
  const ts = Date.now();
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}

// Function to fetch and display superheroes on the home page
function fetchSuperheroes() {
  const searchInput = document.getElementById('searchInput');
  const superheroesList = document.getElementById('superheroesList');

  fetch(`${baseURL}?nameStartsWith=${searchInput.value}&${generateHash()}`)
    .then((response) => response.json())
    .then((data) => {
      superheroesList.innerHTML = '';

      if (data.data.results.length === 0) {
        superheroesList.innerHTML = '<p>No superheroes found.</p>';
        return;
      }

      data.data.results.forEach((superhero) => {
        const li = document.createElement('li');
        const name = document.createElement('span');
        const image = document.createElement('img');
        const description = document.createElement('p');
        const favoriteButton = document.createElement('button');
        name.textContent = superhero.name;
        description.textContent = superhero.description || 'No description available';
        image.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
        favoriteButton.textContent = 'Add to Favorites';
        favoriteButton.classList.add('favorite');

        favoriteButton.addEventListener('click', () => {
          addFavorite(superhero);
        });

        li.appendChild(image);
        li.appendChild(name);
        li.appendChild(description);
        li.appendChild(favoriteButton);
        superheroesList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('Error fetching superheroes:', error);
    });
}

// Function to add superhero to favorites
function addFavorite(superhero) {
  const isAlreadyFavorite = favorites.some((fav) => fav.id === superhero.id);
  if (!isAlreadyFavorite) {
    favorites.push(superhero);
    saveFavoritesToStorage(); // Save favorites to local storage after adding
    alert(`${superhero.name} added to favorites!`);
  } else {
    alert(`${superhero.name} is already in favorites!`);
  }
}

//
// Function to save favorites to local storage
function saveFavoritesToStorage() {
  localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}

// Function to display favorite superheroes on the favorites list
function displayFavoriteSuperheroes() {
  const favoritesList = document.getElementById('favorites');
  favoritesList.innerHTML = '';

  favorites.forEach((superhero) => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const removeButton = document.createElement('button');
    name.textContent = superhero.name;
    removeButton.textContent = 'Remove from Favorites';

    removeButton.addEventListener('click', () => {
      removeFavorite(superhero.id);
    });

    li.appendChild(name);
    li.appendChild(removeButton);
    favoritesList.appendChild(li);
  });
}

// Function to remove superhero from favorites
function removeFavorite(superheroId) {
  favorites = favorites.filter((superhero) => superhero.id !== superheroId);
  saveFavoritesToStorage(); // Save updated favorites to local storage
  displayFavoriteSuperheroes(); // Update the favorites list on the page
  alert('Superhero removed from favorites!');
}

// Add event listener for "Search" button
document.getElementById('searchInput').addEventListener('input', () => {
  fetchSuperheroes();
});

// Add event listener for "Favorite List" button
document.getElementById('favoritesButton').addEventListener('click', () => {
  const favoritesList = document.getElementById('favoritesList');
  const superheroesList = document.getElementById('superheroesList');
  favoritesList.classList.toggle('hidden');
  superheroesList.classList.toggle('hidden');

  if (!favoritesList.classList.contains('hidden')) {
    displayFavoriteSuperheroes();
  }
});

// Add event listener for "Back" button on favorites page
document.getElementById('backButton').addEventListener('click', () => {
  const favoritesList = document.getElementById('favoritesList');
  const superheroesList = document.getElementById('superheroesList');
  favoritesList.classList.toggle('hidden');
  superheroesList.classList.toggle('hidden');
});

// Initial fetch for popular superheroes when the page loads
fetchSuperheroes();
