const API_KEY = "YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const moviesContainer = document.getElementById("movies-container");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genre-filter");
const bookmarkedMoviesContainer = document.getElementById("bookmarked-movies");

fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

async function fetchMovies(url) {
    moviesContainer.innerHTML = `<p class="loading">Loading movies...</p>`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            displayMovies(data.results);
        } else {
            moviesContainer.innerHTML = `<p class="error">No results found.</p>`;
        }
    } catch (error) {
        moviesContainer.innerHTML = `<p class="error">Failed to load movies. Please try again later.</p>`;
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
            <button class="bookmark-btn" onclick="bookmarkMovie(${movie.id}, '${movie.title}', '${movie.poster_path}', ${movie.vote_average})">⭐</button>
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

genreFilter.addEventListener("change", () => {
    const genreId = genreFilter.value;
    const url = genreId
        ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
        : `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
    fetchMovies(url);
});

function bookmarkMovie(id, title, posterPath, rating) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
    const exists = bookmarks.some(movie => movie.id === id);

    if (!exists) {
        bookmarks.push({ id, title, posterPath, rating });
        localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarks));
        displayBookmarkedMovies();
    }
}

function displayBookmarkedMovies() {
    bookmarkedMoviesContainer.innerHTML = "";
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];

    bookmarks.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img src="${movie.posterPath ? IMG_PATH + movie.posterPath : 'https://via.placeholder.com/150'}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>⭐ Rating: ${movie.rating}</p>
        `;

        bookmarkedMoviesContainer.appendChild(movieCard);
    });
}

window.onload = displayBookmarkedMovies;
