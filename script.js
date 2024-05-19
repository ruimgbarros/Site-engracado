document.addEventListener('DOMContentLoaded', () => {
    const CLIENT_ID = 'YOUR_CLIENT_ID';
    const REDIRECT_URI = 'YOUR_REDIRECT_URI';
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
  
    let token = null;
  
    // Check for token in the URL
    const hash = window.location.hash;
    if (hash) {
      const tokenMatch = hash.match(/access_token=([^&]*)/);
      if (tokenMatch) {
        token = tokenMatch[1];
        window.location.hash = '';
        getNewSong();
      }
    } else {
      window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-library-read`;
    }
  
    async function getNewSong() {
      if (!token) return;
  
      try {
        let response = await fetch('https://api.spotify.com/v1/recommendations?seed_genres=pop', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let data = await response.json();
        let track = data.tracks[0];
        displaySong(track);
      } catch (error) {
        console.error('Error fetching the song:', error);
      }
    }
  
    function displaySong(track) {
      document.getElementById('song-name').textContent = track.name;
      document.getElementById('artist-name').textContent = track.artists[0].name;
      document.getElementById('song-preview').src = track.preview_url;
  
      // Set genre buttons
      let genres = ['pop', 'rock', 'hip-hop', 'jazz']; // Example genres
      genres = shuffleArray(genres); // Randomize genres
      const buttons = document.querySelectorAll('.genre-btn');
      buttons.forEach((button, index) => {
        button.textContent = genres[index];
        button.onclick = () => checkAnswer(track.id, genres[index]);
      });
    }
  
    function checkAnswer(trackId, genre) {
      // Placeholder for actual genre checking logic
      if (genre === 'correct-genre') { // Replace with the correct genre from the track info
        alert('Correct!');
        getNewSong();
      } else {
        alert('Try again!');
      }
    }
  
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  });