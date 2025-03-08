const API_KEY = "YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const moviesContainer = document.getElementById("movies-container");
const searchInput = document.getElementById("search");

fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/150'}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>⭐ Rating: ${movie.vote_average}</p>
        `;

        moviesContainer.appendChild(movieCard);
    });
}


searchInput.addEventListener("keyup", () => {
    const query = searchInput.value;
    if (query.length > 2) {
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    }
});
