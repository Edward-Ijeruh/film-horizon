import React, { useContext, useEffect, useCallback, useState } from "react";
import useMovies from "./useMovies";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/heroimg.jpg";
import posterFallback from "../assets/posterimg-fallback.jpg";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { WatchlistContext } from "./WatchlistProvider";

// Access global state
const MovieList = () => {
  const { state, dispatch } = useContext(WatchlistContext); 
  const { searchQuery, filteredMovies, currentPage } = state; 
  const [isOpen, setIsOpen] = useState(false); 
  const { movies, loading, totalPages } = useMovies(currentPage); 
  const [moviesList, setMoviesList] = useState([]); 
  const [isBottom, setIsBottom] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook
  const { search } = useLocation(); // Initialize useLocation hook to access URL params

  // Fetch next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch({type: "setCurrentPage", payload: currentPage + 1});
    }
  };

  // Detect when to show the "More" button
  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (!isBottom && scrollTop + clientHeight >= scrollHeight - 100) {
          setIsBottom(true);
        } else if (!isBottom && scrollTop + clientHeight < scrollHeight - 100) {
          setIsBottom(false);
        }
      }, 200);
     
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchMovies = useCallback(
    async (query, page = 1) => {
      if (query.trim() === "") {
        setMoviesList([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=224fb7362c8a07c0e01f6fcb5bf3d178&query=${query}&page=${page}`
        );
        if (page === 1) {
          setMoviesList(response.data.results); // Replace movies on the first page
        } else {
          setMoviesList((prevMovies) => [...prevMovies, ...response.data.results]); // Append movies
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
    [dispatch] // Ensure stable function reference
  );

  // Debounced Effect to Fetch Movies
  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const queryFromUrl = queryParams.get("search") || "";

    if (queryFromUrl && queryFromUrl !== searchQuery) {
      dispatch({ type: "setSearchQuery", payload: queryFromUrl });
    }

    const handler = setTimeout(() => {
      fetchMovies(searchQuery, currentPage); // Call fetchMovies with the global searchQuery
    }, 1000); 

    return () => {
      clearTimeout(handler); // Clear timeout if input changes before delay finishes
    };
  }, [search, searchQuery, currentPage, fetchMovies, dispatch]);

  const handleSearch = (e) => {
    const query = e.target.value;
    dispatch({ type: "setSearchQuery", payload: query });

    // Update the URL with the search query
    navigate(`/?search=${query}`, { replace: true }); // replace ensures no extra history is added
  };

  if (loading) return <div className="text-white text-xl">Loading...</div>;

  // Use search results if available, otherwise fallback to trending movies
  const displayedMovies = searchQuery ? moviesList : movies;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 bg-gray-900 shadow-lg z-50">
        <div className="flex justify-between items-center p-4 md:px-8 mx-auto">
          <Link to="/" className="text-2xl font-bold text-red-600">
            FilmHorizon
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-6">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <Link to="/watchlist" className="flex items-center hover:text-red-600">
              {/* Display "Watchlist" text with count */}
              Watchlist
              {(state.watchlist && state.watchlist.length >= 0) ? (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.watchlist.length}
                </span>
              ) : (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              )}
            </Link>           
          </div>

          {/* Hamburger Menu Button (Mobile Only) */} 
          <button className="sm:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)} > 
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />} 
          </button> 
      </div>
           {/* Mobile Dropdown Menu */} 
          <div className={`absolute top-14 right-4 bg-gray-800 rounded-lg shadow-lg transition-transform duration-300 p-4 space-y-2 sm:hidden 
            ${ isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none" }`} > 
            <Link to="/" className="block text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
               Home 
            </Link> 
            <Link to="/watchlist" className="flex items-center text-white hover:text-red-600" 
              onClick={() => setIsOpen(false)} > 
              {/* Display "Watchlist" text with count */} 
              Watchlist {(state.watchlist && state.watchlist.length >= 0) ? ( 
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"> 
                  {state.watchlist.length} 
                </span> ) : (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
              )} 
            </Link>
          </div>
      </nav>
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative">
          <div
            className="w-full h-72 sm:h-96 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-center items-center text-center space-y-4">
              <h1 className="text-4xl font-bold">Trending Movies</h1>
              <p className="text-xl">Explore the best movies of the week</p>
              {/* Search Bar */}
              <input
                type="search"
                placeholder="Search for movies..."
                value={searchQuery} // Bind to global searchQuery
                onChange={handleSearch} // Update global searchQuery and URL
                className="px-4 py-2 border rounded-lg text-white w-3/4 sm:w-3/4 md:w-1/2 bg-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Movie List */}
        <div className="p-6">
          <h1 className="text-3xl mb-6">{searchQuery ? "Search Results" : "Popular Movies"}</h1>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedMovies.length > 0 ? (
              displayedMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`} // Link to movie details page
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-200 hover:scale-105"
                >
                  <img
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : `${posterFallback}`}
                      alt={movie.title}
                      className="w-full h-40 sm:h-72 object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="text-white text-xs sm:text-xl font-semibold">{movie.title}</h3>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No movies found.</p>
            )}
          </div>
        </div>
      </main>

      {/* Floating "More" button */}
      {isBottom && currentPage < totalPages && (
        <button 
          onClick={handleNextPage}
          className="relative bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-10 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 cursor-pointer hover:scale-105 w-24 sm:w-24"
        >
          More
        </button>
      )}

      {/* Footer */} 
      <footer className="bg-gray-800 text-white text-center py-4 mt-8"> <p>&copy; 2025 FilmHorizon. All rights reserved.</p> </footer>
    </div>
  );
};

export default MovieList;
