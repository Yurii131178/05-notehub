// import axios from "axios";
// import { type Movie } from "../types/movie";

// const BASE_URL = "https://api.themoviedb.org/3/search/movie";

// interface FetchMoviesProps {
//   results: Movie[];
// }

// export const fetchMovies = async (query: string): Promise<Movie[]> => {
//   const { data } = await axios.get<FetchMoviesProps>(BASE_URL, {
//     params: {
//       query,
//     },
//     headers: {
//       Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
//     },
//   });

//   return data.results;
// };

//////////////////////////

import axios from "axios";
import { type Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export interface FetchMoviesProps {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<FetchMoviesProps> => {
  const { data } = await axios.get<FetchMoviesProps>(BASE_URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return data;
};
