import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieCard from "./OmdbMovieCard";
import "./App.css";
import SearchIcon from "./search.svg";
import axios from "axios";
import MovieDetails from "./OmdbMovieDetails";

const OmdbMovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const searchMovies = async () => {
    try {
      const response = await axios.get(
        `https://movieapp-backend-ndtw.onrender.com/api/Movie/search?title=${searchTerm}`
      );
      setSearchResults(response.data.search);
      setMovies(response.data.search);
      saveSearchToHistory(searchTerm);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const saveSearchToHistory = (query) => {
    const existingHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const updatedHistory = [query, ...existingHistory.slice(0, 4)];
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  useEffect(() => {
    const initialHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(initialHistory);
  }, []);

  return (
    <Router>
      <div className="app">
        <h1>OMDB MovieApp</h1>

        <div className="search">
          <input
            placeholder="Search for movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchMovies();
              }
            }}
          />
          <img
            src={SearchIcon}
            alt="search"
            onClick={() => searchMovies(searchTerm)}
          />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {searchResults !== null && searchResults?.length > 0 ? (
                  <div className="container">
                    {movies &&
                      movies.map((movie) => (
                        <Link key={movie.imdbID} to={`https://movieapp-backend-ndtw.onrender.com/api/Movie/${movie.imdbID}`}>
                          <MovieCard movie={movie} />
                        </Link>
                      ))}
                  </div>
                ) : (
                  <div className="empty">
                    <h1>
                      {searchResults !== null
                        ? "No search found"
                        : "No movie found"}
                    </h1>
                  </div>
                )}

                <div>
                  <h2>Search History:</h2>
                  <ul>
                    {searchHistory.map((query, index) => (
                      <li key={index}>{query}</li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          />
          <Route path="https://movieapp-backend-ndtw.onrender.com/api/Movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default OmdbMovieApp;
