import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieDetails = ({ match }) => {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://movieapp-backend-ndtw.onrender.com/api/Movie/${match.params.id}`
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [match.params.id]);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{movieDetails.Title}</h1>
      <p>Year: {movieDetails.Year}</p>
     
    </div>
  );
};

export default MovieDetails;
