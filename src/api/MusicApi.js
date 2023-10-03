import React, { useEffect, useState } from 'react';
import Styles from "./Music.module.css";
const CLIENT_ID = "91f92923728f4ac08ed25aa7cada0230";
const CLIENT_SECRET = "032c0e6debcd40e68a66a0ba279b7b38";

function MusicApi() {
  const [searchResults, setSearchResults] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [selectedSong,setSelectedSong] = useState(null)
  const [type,setType] = useState("artist");
  const [showDropdown, setShowDropdown] = useState(false);

  var auth = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  };

  useEffect(() => {
    fetch('https://accounts.spotify.com/api/token', auth)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  },[]);

  function convertSpotifyUriToEmbedUrl(spotifyUri) {
    const parts = spotifyUri.split(':');
    if (parts.length === 3 && parts[0] === 'spotify' && parts[1] === 'track') {
      const albumId = parts[2];
      return `https://open.spotify.com/embed/track/${albumId}`;
    }else if (parts.length === 3 && parts[0] === 'spotify' && parts[1] === 'album') {
      const albumId = parts[2];
      return `https://open.spotify.com/embed/album/${albumId}`;
    }
    return null; 
  }

async function search(val) {
  if ((val) && (type === 'track')) {
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };
    var searchResults = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(val)}&type=track`,
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        return data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          uri: convertSpotifyUriToEmbedUrl(track.uri),
          preview_url: track.preview_url,
          artists: track.artists.map((artist) => artist.name).join(', '),
          albumUri: track.album.images[0].url,
        }));
      });
    setSearchResults(searchResults);
    setShowDropdown(true);
  }

  if ((val) && (type === 'artist')) {
    var artistParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };
    var artistID = await fetch(
      'https://api.spotify.com/v1/search?q=' + val + '&type=artist',
      artistParams
    )
      .then((response) => response.json())
      .then((data) => data.artists.items[0].id);

    var albums = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums`,
      artistParams
    )
      .then((response) => response.json())
      .then((data) => {
        return data.items.map((album) => ({
          artist: album.artists[0].name,
          title: album.name,
          uri: convertSpotifyUriToEmbedUrl(album.uri),
          albumUri: album.images[0].url,
        }));
      });
    setSearchResults(albums);
    setShowDropdown(true);
  }
  }  
  function handleSongSelection(song) {
    setSelectedSong(song);
    setShowDropdown(false); 
  }

   return (
    <div className={Styles.App}>
    <div className={Styles.musicdiv}>
      <div className={Styles.search_container}>
        <input
          type='text'
          placeholder='Search for Song'
          onChange={(e) => search(e.target.value)}
        />
        <div className={Styles.radio_buttons}>
          <input
            id='artist'
            type='radio'
            name='song'
            value='artist'
            defaultChecked
            onChange={(e) => {
              setType(e.target.value);
              setShowDropdown(false); 
            }}
          />
          <label htmlFor='artist'>Artist</label>
          <input
            id='track'
            type='radio'
            name='song'
            value='track'
            onChange={(e) => {
              setType(e.target.value);
              setShowDropdown(false); 
            }}
          />
          <label htmlFor='track'>Songs</label>
        </div>
      </div>
      {showDropdown && (
        <div className={Styles.dropdown}>
          <ul>
            {searchResults.slice(0, 5).map((track) => (
              <li
                key={track.id}
                onClick={() => handleSongSelection(track)}
                className={Styles.dropdown_item}
              >
                <img
                  src={track.albumUri}
                  alt={track.name}
                  className={Styles.dropdown_image}
                />
                <p className={Styles.dropdown_text}>
                  {type === 'track'
                    ? `${track.name} - ${track.artists}`
                    : `${track.title} - ${track.artist}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {
      selectedSong && type === 'track' && !showDropdown &&(
        <iframe
          src={selectedSong.uri}
          width='90%'
          height='600'
          frameBorder='0'
          allowtransparency='true'
          allow='encrypted-media'
          title='Spotify Track'
        ></iframe>
      )}

      {selectedSong && type === 'artist' && !showDropdown && (
        <iframe
          src={selectedSong.uri}
          width='90%'
          height='600'
          frameBorder='0'
          allowtransparency='true'
          allow='encrypted-media'
          title='Spotify Album'
        ></iframe>
      )}
      </div>
    </div>
  );
}

export default MusicApi;