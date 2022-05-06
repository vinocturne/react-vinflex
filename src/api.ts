const BASE_PATH = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_MOVIE_DB_KEY;

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface ISearchResult {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}
export interface IPopularResult {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(
        `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
    ).then((response) => response.json());
}

export function searchMovies(keyword: string) {
    return fetch(
        `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
    ).then((response) => response.json());
}

export function getPopularMovies() {
    return fetch(
        `${BASE_PATH}/movie/popular?api_key=${API_KEY}`
    ).then((response) => response.json());
}
