// import { useState } from "react";
// import { fetchMovies } from "../../services/movieService";
// import { type Movie } from "../../types/movie";
// import SearchBar from "../SearchBar/SearchBar";
// import MovieGrid from "../MovieGrid/MovieGrid";
// import Loader from "../Loader/Loader";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import MovieModal from "../MovieModal/MovieModal";
// import toast, { Toaster } from "react-hot-toast";
// import css from "./App.module.css";

// export default function App() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//   const handleSearch = async (query: string) => {
//     setLoading(true);
//     setError(false);
//     setMovies([]);
//     try {
//       const results = await fetchMovies(query);
//       if (results.length === 0) {
//         toast.error("No movies found for your request.");
//       }
//       setMovies(results);
//     } catch {
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectMovie = (movie: Movie) => {
//     setSelectedMovie(movie);
//   };

//   const handleCloseModal = () => {
//     setSelectedMovie(null);
//   };

//   return (
//     <>
//       <SearchBar onSubmit={handleSearch} />
//       <Toaster />
//       {loading && <Loader />}
//       {error && <ErrorMessage />}
//       {!loading && !error && movies.length > 0 && (
//         <MovieGrid movies={movies} onSelect={handleSelectMovie} />
//       )}
//       {selectedMovie && (
//         <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
//       )}
//     </>
//   );
// }

////////////////////////////

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isLoading && !isError && query && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isLoading, isError, movies.length, query]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
