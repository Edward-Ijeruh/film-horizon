import { Routes, Route } from "react-router-dom";
import MovieList from "./Components/MovieList";
import MovieDetail from "./Components/MovieDetail";
import Watchlist from "./Components/Watchlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/watchlist" element={<Watchlist />} />
    </Routes>
  );
}

export default App;
