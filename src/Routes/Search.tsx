import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { IMoviesResult, searchMovies } from "../api";

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data, isLoading } = useQuery<IMoviesResult>(
        ["movies", "search"],
        () => searchMovies(keyword as any)
    );

    return <div></div>;
}

export default Search;
