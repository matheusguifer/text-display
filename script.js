// Define the variables for the form, artist and song dropdown menus, lyrics container, and buttons
const form = document.getElementById('form');
const artistSelect = document.getElementById('artist-select');
const songSelect = document.getElementById('song-select');
const lyricsContainer = document.getElementById('lyrics-container');
const fontColorButton = document.getElementById('font-color-button');
const fontColorMenu = document.getElementById('font-color-menu');
const backgroundColorButton = document.getElementById('background-color-button');
const backgroundColorMenu = document.getElementById('background-color-menu');
const nextButton = document.getElementById('next-button');
const repeatButton = document.getElementById('repeat-button');
const chorusButton = document.getElementById('chorus-button');
const randomColorButton = document.getElementById('random-color-button');

// Get the controls container
const controlsContainer = document.getElementById('controls');

// When the form is submitted, show the controls and display the lyrics
form.addEventListener('submit', (event) => {
    // Prevent the form from refreshing the page
    event.preventDefault();
    // Show the controls
    controlsContainer.style.display = 'block';
    // Get the selected artist and song
    const artist = artistSelect.value;
    const song = songSelect.value;
    // Fetch the lyrics and display them
    showLyrics(artist, song);
});

// When the lyrics are finished, hide the controls
lyricsContainer.addEventListener('animationend', () => {
    controlsContainer.style.display = 'none';
});

// Change the font color when the font color button is clicked
fontColorButton.addEventListener('click', () => {
    // Get the selected font color
    const fontColor = fontColorMenu.value;
    // Change the font color
    lyricsContainer.style.color = fontColor;
});

// Change the background color when the background color button is clicked
backgroundColorButton.addEventListener('click', () => {
    // Get the selected background color
    const backgroundColor = backgroundColorMenu.value;
    // Change the background color
    lyricsContainer.style.backgroundColor = backgroundColor;
});

// If the current verse is not the last verse, advance to the next verse
nextButton.addEventListener('click', () => {
    // Split the lyrics into an array of verses
    const verses = lyricsContainer.textContent.split('\n');
    // Get the current verse
    const currentVerse = lyricsContainer.dataset.currentVerse;
    // If the current verse is not the last verse, advance to the next verse
    if (currentVerse < verses.length - 1) {
        // Increment the current verse
        lyricsContainer.dataset.currentVerse = parseInt(currentVerse) + 1;
        // Display the next verse
        lyricsContainer.textContent = verses[currentVerse + 1];
    }
});

// Repeat the current verse
repeatButton.addEventListener('click', () => {
    // Get the current verse
    const currentVerse = lyricsContainer.dataset.currentVerse;
    // Split the lyrics into an array of verses
    const verses = lyricsContainer.textContent.split('\n');
    // Display the current verse
    lyricsContainer.textContent = verses[currentVerse];
});

// Display the chorus
chorusButton.addEventListener('click', () => {
    // Split the lyrics into an array of verses
    const verses = lyricsContainer.textContent.split('\n');
    // Find the index of the chorus
    const chorusIndex = verses.findIndex((verse) => verse.startsWith('[Chorus]'));
    // If the chorus was found, display it
    if (chorusIndex !== -1) {
        lyricsContainer.textContent = verses[chorusIndex];
        lyricsContainer.dataset.currentVerse = chorusIndex;
    }
});

// Generate a random color combination
randomColorButton.addEventListener('click', () => {
    // Generate a random hex color
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    // Set the font color and background color to the random color
    lyricsContainer.style.color = randomColor;
    lyricsContainer.style.backgroundColor = randomColor;
});

// Fetch the lyrics for the selected artist and song and display them
async function showLyrics(artist, song) {
    // Check if the lyrics are available locally
    const lyrics = await fetchLocalLyrics(artist, song);
    // If the lyrics are not available locally, fetch them from the Musixmatch API
    if (!lyrics) {
        const apiKey = 'YOUR_MUSIXMATCH_API_KEY';
        const response = await fetch(
            `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${song}&q_artist=${artist}&apikey=${apiKey}`
            );
            const data = await response.json();
            // Check if the lyrics were found
            if (data.message.header.status_code === 200) {
                lyricsContainer.textContent = data.message.body.lyrics.lyrics_body;
                // Set the current verse to the first verse
                lyricsContainer.dataset.currentVerse = 0;
                
                
                
                // Save the lyrics for the selected artist and song to a local text file
                async function saveLyrics(artist, song, lyrics) {
                    // Create a new Blob with the lyrics as the content
                    const blob = new Blob([lyrics], { type: 'text/plain' });
                    // Create a URL for the Blob
                    const url = URL.createObjectURL(blob);
                    // Create a link element with the URL and the artist and song as the file name
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${artist} - ${song}.txt`;
                    // Append the link to the body and click it to download the file
                    document.body.appendChild(link);
                    link.click();
                    // Remove the link from the body
                    document.body.removeChild(link);
                }
                
                // Fetch the lyrics for the selected artist and song from a local text file
                async function fetchLocalLyrics(artist, song) {
                    // Check if the lyrics folder exists
                    const lyricsFolder = await Deno.stat('lyrics');
                    // If the lyrics folder exists, check if the text file for the selected artist and song exists
                    if (lyricsFolder && lyricsFolder.isDirectory) {
                        try {
                            // Try to stat the text file
                            await Deno.stat(`lyrics/${artist}/${song}.txt`);
                            // If the file exists, read it and return the lyrics
                            return await Deno.readTextFile(`lyrics/${artist}/${song}.txt`);
                        } catch (error) {
                            // If the file does not exist, return null
                            return null;
                        }
                    }
                    // If the lyrics folder does not exist, return null
                    return null;
                }
                
                // Populate the artist and song dropdown menus with the options from the local text files
                async function populateDropdownMenus() {
                    //
                    
                    