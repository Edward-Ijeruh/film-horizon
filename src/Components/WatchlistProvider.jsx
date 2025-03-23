import React, { createContext, useReducer, useEffect } from 'react';

// Watchlist initial state
const initialState = { 
  watchlist: [], 
  searchQuery: "",
  filteredMovies: [], 
  currentPage: 1,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'addMovie':
      // Check if movie exists
      if (state.watchlist.some(movie => movie.id === action.payload.id)) {
        return state;
      }
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    case 'removeMovie':
      return { ...state, watchlist: state.watchlist.filter(movie => movie.id !== action.payload.id) };
    case 'loadWatchlist':
      return { ...state, watchlist: action.payload || [] };
    case 'setSearchQuery': 
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case 'setFilteredMovies': 
      return { ...state, filteredMovies: action.payload };
    case 'setCurrentPage':
      return { ...state, currentPage: action.payload }
    default:
      return state;
  }
}

// Watchlist context
export const WatchlistContext = createContext();

// Context provider component
export const WatchlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load watchlist from localStorage on page load
  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const savedPage = JSON.parse(localStorage.getItem('currentPage')) || 1;
    dispatch({ type: 'loadWatchlist', payload: savedWatchlist});
    dispatch({ type: 'setCurrentPage', payload: savedPage})
  }, []);

  // Save to watchlist per change
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
  }, [state.watchlist]);

  // Save current page per change
  useEffect(() => {
    localStorage.setItem('currentPage', JSON.stringify(state.currentPage));
  }, [state.currentPage]);

  return (
    <WatchlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WatchlistContext.Provider>
  );
};
