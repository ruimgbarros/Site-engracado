const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN';
const genreList = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Reggae', 'Country'];

document.addEventListener('DOMContentLoaded', () => {
    loadRandomSong();
});

function loadRandomSong() {
    // Replace with your own method to get random song data and genre from Spotify
    fetchRandomSong().then(data => {
        const songUrl = data.url;
        const correctGenre = data.genre;
        const genres = shuffleArray([correctGenre, ...getRandomGenres(correctGenre)]);

        document.getElementById('spotify-embed').src = songUrl;
        document.getElementById('btn1').textContent = genres[0];
        document.getElementById('btn2').textContent = genres[1];
        document.getElementById('btn3').textContent = genres[2];
        document.getElementById('btn4').textContent = genres[3];

        document.getElementById('btn1').onclick = () => checkAnswer(genres[0], correctGenre);
        document.getElementById('btn2').onclick = () => checkAnswer(genres[1], correctGenre);
        document.getElementById('btn3').onclick = () => checkAnswer(genres[2], correctGenre);
        document.getElementById('btn4').onclick = () => checkAnswer(genres[3], correctGenre);
    });
}

function fetchRandomSong() {
    // Example Spotify API call to get random track and genre
    return fetch('https://api.spotify.com/v1/tracks/random', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const songUrl = `https://open.spotify.com/embed/track/${data.id}`;
        const genre = data.genre; // Adjust based on actual data structure
        return { url: songUrl, genre };
    });
}

function getRandomGenres(correctGenre) {
    const filteredGenres = genreList.filter(genre => genre !== correctGenre);
    return shuffleArray(filteredGenres).slice(0, 3);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkAnswer(selectedGenre, correctGenre) {
    const resultDiv = document.getElementById('result');
    if (selectedGenre === correctGenre) {
        resultDiv.textContent = 'Correct! The genre is ' + correctGenre;
    } else {
        resultDiv.textContent = 'Wrong! The correct genre was ' + correctGenre;
    }
    setTimeout(() => {
        resultDiv.textContent = '';
        loadRandomSong();
    }, 3000);
}

