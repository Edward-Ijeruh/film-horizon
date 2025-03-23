import React, { useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { WatchlistContext } from "./WatchlistProvider";
import { useNotification } from "./NotificationProvider";
import posterFallback from "../assets/posterimg-fallback.jpg";
import castFallback from "../assets/cast-fallback4.jpg";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const {state, dispatch} = useContext(WatchlistContext);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=224fb7362c8a07c0e01f6fcb5bf3d178&append_to_response=credits`
      );
      setMovie(response.data);
    };
    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    if (movie) {
      setIsInWatchlist(state.watchlist.some((m) => m.id === movie.id))
    }
  }, [movie, state.watchlist]);

  const handleBack = () => {
    navigate("/");
  };

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      dispatch({type: 'removeMovie', payload: {id: movie.id}});
      addNotification(`${movie.title} removed from watchlist`, "error");
    } else {
      dispatch({type: 'addMovie', payload: {id: movie.id, title: movie.title, poster_path: movie.poster_path}});
      addNotification(`${movie.title} added to watchlist`, "success");
    }
    setIsInWatchlist(!isInWatchlist);
  };
  

  if (!movie) return <div className="text-white text-xl">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="p-3 rounded-full bg-gray-800 text-white shadow-md fixed top-6 left-6 z-10 hover:bg-gray-700 transition-colors"
      >
         <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="p-6 pt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="md:w-1/3">
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                  : `${posterFallback}`}
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => (e.target.src = {posterFallback})}
              />
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3 text-white space-y-4">
              <h1 className="text-4xl font-semibold">{movie.title}</h1>
              <p className="text-gray-400">{movie.release_date}</p>
              <p className="text-gray-300 mt-4">{movie.overview}</p>

              {/* Genres */}
              <div className="mt-6">
                <h3 className="text-2xl font-semibold">Genres:</h3>
                <ul className="list-disc pl-6 text-gray-300">
                  {movie.genres.map((genre) => (
                    <li key={genre.id}>{genre.name}</li>
                  ))}
                </ul>
              </div>

              {/* Additional Movie Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold">Language:</h3>
                  <p className="text-gray-300">{movie.original_language}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">Runtime:</h3>
                  <p className="text-gray-300">{movie.runtime} minutes</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">Vote Average:</h3>
                  <p className="text-gray-300">{movie.vote_average}/10</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">Tagline:</h3>
                  <p className="text-gray-300 italic">{movie.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cast Details */}
          {movie?.credits?.cast && (
            <div className="mt-6">
              <h3 className="text-2xl mb-2 font-semibold">Cast:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {movie.credits.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` 
                        : `${castFallback}`}
                      alt={actor.name}
                      className="w-x h-48 mx-auto rounded-lg shadow-md"
                      onError={(e) => (e.target.src = {castFallback})}
                    />
                    <p className="text-gray-300 mt-2">{actor.name}</p>
                    <p className="text-gray-400 text-sm">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Heart Button to Add to Watchlist */}
          <div className="flex justify-center">
            <button
              onClick={toggleWatchlist}
              className={`w-16 h-16 rounded-full flex items-center justify-center 
              ${isInWatchlist ? "bg-red-600" : "bg-gray-800"} shadow-lg transition-colors transform hover:scale-105`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isInWatchlist ? "red" : "none"}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 21l-8-8a5 5 0 010-7 5 5 0 017 0 5 5 0 017 0 5 5 0 010 7l-8 8z"
                />
              </svg>

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
