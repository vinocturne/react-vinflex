import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { IMoviesResult, ITvResult, searchMovies, searchTvs } from "../api";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";

const SearchContainer = styled.div``;
const infoVariants = {
    hover: {
        opacity: 1,
    },
};
const SearchList = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    position: absolute;
    top: 100px;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
    /* background-color: white; */
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center;
    height: 200px;
    position: relative;
    font-size: 24px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 20px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data: movieList, isLoading: movieLoading } = useQuery<
        IMoviesResult
    >(["movies", "search"], () => searchMovies(keyword as any));
    const { data: tvList, isLoading: tvLoading } = useQuery<ITvResult>(
        ["tvs", "search"],
        () => searchTvs(keyword as any)
    );
    console.log(tvList);
    return (
        <SearchContainer>
            <SearchList>
                {movieList?.results.map((movie) => (
                    <Box
                        // layoutId={movie.id + props.listData.type}
                        // variants={boxVariants}
                        key={movie.id}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        // onClick={() => onBoxClicked(movie.id)}
                    >
                        <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                        </Info>
                    </Box>
                ))}
                {/* {movieList?.results.map((movie) => (
                    <Box
                        // layoutId={movie.id + props.listData.type}
                        // variants={boxVariants}
                        key={movie.id}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        // onClick={() => onBoxClicked(movie.id)}
                    >
                        <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                        </Info>
                    </Box>
                ))} */}
            </SearchList>
        </SearchContainer>
    );
}

export default Search;
