import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "224fb7362c8a07c0e01f6fcb5bf3d178"; 

const useMovies = (page) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        setMovies(page === 1 ? response.data.results : (prevMovies) => [...prevMovies, ...response.data.results]);
        setTotalPages(response.data.total_pages)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  return { movies, loading, totalPages };
};

export default useMovies;
