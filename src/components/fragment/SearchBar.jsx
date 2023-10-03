import React, {useEffect, useRef, useState} from "react";
import SearchSharpIcon from "@material-ui/icons/SearchSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import '../assets/scss/SearchBar.scss';
import {useDispatch} from "react-redux";
import {setSearch} from "../../actions/actions";
import {Link} from "react-router-dom";
import MusicApi from "../../api/MusicApi";
import SearchWithMusic from "./SearchWithMusic";
import Styles from "./Music.module.css";

const CLIENT_ID = 'f1cce293f3854de9a2ff38bdbda56493';
const CLIENT_SECRET = '9e5e699957d0435faf7ab88859dde4ee';

const SearchBar = ({setMusic}) => {
    
  const [searchResults, setSearchResults] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [selectedSong,setSelectedSong] = useState(null)
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
    if (val) {
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
    }  
    function handleSongSelection(song) {
      setSelectedSong(song);
      setMusic(song.uri);
      setShowDropdown(false); 
    }

    return (
      <>
        <div className="SearchBar">
            <form  className={"search-container"}>
                    <>
                        <SearchSharpIcon style={{color: "grey"}} className="search-icon" fontSize="small"/>
                        <input id={"search-input"}
                               name={"searchQuery"}
                               onChange={(e) => search(e.target.value)}
                               placeholder={"Search a track..."}
                               type="text"
                        />
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
                     {track.name} - {track.artists}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
                    </>

            </form>
            
        </div>
        <div className={Styles.popup}>
        </div>
  </>
    );
};
export default SearchBar;