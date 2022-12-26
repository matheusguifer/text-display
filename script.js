document.querySelector('#start').addEventListener('click', async () => {
    const [artist, song] = document.querySelectorAll('select')
    
    let lyrics
    if (document.querySelector('#fetch-api').checked) {
        lyrics = await fetchLyricsFromAPI(artist.value, song.value)
    } else {
        lyrics = await fetchLyricsFromFile(artist.value, song.value)
    }
    let counter = 0
    
    displayLyrics(lyrics, counter)
    document.querySelector('.controls').style.display = 'flex'
    document.querySelector('#next').addEventListener('click', () => {
        displayLyrics(lyrics, ++counter)
    })
    document.querySelector('#prev').addEventListener('click', () => {
        displayLyrics(lyrics, --counter)
    })
})

document.querySelector('#font-family').addEventListener('change', (event) => {
    document.querySelector('.lyrics').style.fontFamily = event.target.value
})

document.querySelector('#chorus').addEventListener('click', () => {
    displayChorus()
})

async function fetchLyricsFromAPI(artist, song) {
    try {
        const API_KEY = 'your-api-key-here'
        const response = await fetch(
            `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${song}&q_artist=${artist}&apikey=${API_KEY}`
            )
            const data = await response.json()
            const lyrics = data.message.body.lyrics.lyrics_body
            
            return lyrics
        } catch (error) {
            console.error(error)
        }
    }
    
    async function fetchLyricsFromFile(artist, song) {
        try {
            const response = await fetch(`/lyrics/${artist}/${song}.txt`)
            const data = await response.text()
            
            return data
        } catch (error) {
            console.error(error)
        }
    }
    
    function displayLyrics(lyrics, counter) {
        const lines = lyrics.split('\n')
        document.querySelector('.lyrics').textContent = lines[counter]
        
        if (counter === lines.length - 1) {
            document.querySelector('#next').style.display = 'none'
        } else {
            document.querySelector('#next').style.display = 'inline-block'
        }
    }
    
    function displayChorus() {
        // code to display the chorus goes here
    }
    
    // This function fetches the data from the /lyrics/ folder and maps it to create option elements for the artist dropdown menu
async function fetchArtists() {
    // Use the fetch() function to retrieve the data from the /lyrics/ folder
    const response = await fetch('/lyrics/')
    // Parse the response to JSON
    const data = await response.json()
  
    // Map the data to create option elements for the artist dropdown menu
    const artists = data.map((artist) => {
      return `<option value="${artist}">${artist}</option>`
    })
    // Return the option elements as a string
    return artists.join('')
  }
  
  // This function fetches the data from the selected artist's folder and maps it to create option elements for the song dropdown menu
  async function fetchSongs(artist) {
    // Use the fetch() function to retrieve the data from the selected artist's folder
    const response = await fetch(`/lyrics/${artist}/`)
    // Parse the response to JSON
    const data = await response.json()
  
    // Map the data to create option elements for the song dropdown menu
    const songs = data.map((song) => {
      return `<option value="${song.split('.')[0]}">${song.split('.')[0]}</option>`
    })
    // Return the option elements as a string
    return songs.join('')
  }
  
  // This event listener waits for the page to load, then it fetches the data for the artist dropdown menu and sets the innerHTML of the artist dropdown element
  document.addEventListener('DOMContentLoaded', async () => {
    const artists = await fetchArtists()
    document.querySelector('#artist').innerHTML = artists
  
    // This event listener waits for the artist dropdown element to change, then it fetches the data for the song dropdown menu and sets the innerHTML of the song dropdown element
    document.querySelector('#artist').addEventListener('change', async (event) => {
      const songs = await fetchSongs(event.target.value)
      document.querySelector('#song').innerHTML = songs
    })
  })
  