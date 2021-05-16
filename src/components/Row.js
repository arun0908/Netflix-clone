import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './Row.css';
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseurl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]); /* The square brackets if left blank means that the row refreshes once the page loads and never again, 
    but if we pass a prop in there like[movies] then it refreshes or loads every time the movie changes */

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            //https: //developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };


    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            if (movie?.name || movie?.title) {
                movieTrailer(movie?.name || movie?.title)
                    .then((url) => {
                        const urlParams = new URLSearchParams(new URL(url).search);
                        setTrailerUrl(urlParams.get("v"));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {/*several row posters*/}
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${baseurl}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} />
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
