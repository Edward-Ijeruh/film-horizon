import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WatchlistContext } from "./WatchlistProvider";
import { useNotification } from "./NotificationProvider"; 

const Watchlist = () => {
  const { state, dispatch } = useContext(WatchlistContext);
  const { addNotification } = useNotification(); 
  const navigate = useNavigate();

  const removeFromWatchlist = (id, title) => {
    dispatch({ type: "removeMovie", payload: { id } });
    addNotification(`${title} removed from watchlist`, "error");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
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

      {/* Main Content */}
      <main className="flex-grow p-6 pt-20 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Watchlist</h1>

        {state.watchlist.length === 0 ? (
          <p className="text-center text-gray-400">Your watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {state.watchlist.map((movie) => (
              <div key={movie.id} className="relative bg-gray-800 p-4 rounded-lg shadow-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-60 object-cover rounded-lg"
                />
                <h3 className="mt-2 text-lg font-semibold">{movie.title}</h3>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWatchlist(movie.id, movie.title)}
                  className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-500 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
