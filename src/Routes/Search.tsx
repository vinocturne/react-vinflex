import styled from "styled-components";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import {
    getMovieDetail,
    getTvDetail,
    IMovieDetail,
    IMoviesResult,
    ITvDetail,
    ITvResult,
    searchMovies,
    searchTvs,
} from "../api";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";
import Detail from "../Components/Detail";
import { useTranslation } from "react-i18next";

const SearchContainer = styled.div`
    position: relative;
    top: 100px;
`;
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
    /* position: absolute; */
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
    &:nth-child(6n) {
        transform-origin: center right;
    }
    &:nth-child(6n + 1) {
        transform-origin: center left;
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

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        zIndex: 999,
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
        },
    },
};

const MovieListTitle = styled.div`
    font-size: 32px;
    padding: 30px;
`;

function Search() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const movieMatch = useMatch("/search/movie/:id");
    const tvMatch = useMatch("/search/tv/:id");
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data: movieList } = useQuery<IMoviesResult>(
        ["movies", "search"],
        () => searchMovies(keyword as any)
    );
    const { data: tvList } = useQuery<ITvResult>(["tvs", "search"], () =>
        searchTvs(keyword as any)
    );
    const { data: movieDetail, refetch: movieDetailRefetch } = useQuery<
        IMovieDetail
    >(["detail", movieMatch && movieMatch?.params.id], getMovieDetail, {
        enabled: false,
    });
    const { data: tvDetail, refetch: tvDetailRefetch } = useQuery<ITvDetail>(
        ["detail", tvMatch && tvMatch.params.id],
        getTvDetail,
        { enabled: false }
    );
    const clickedMovie = async (id: number) => {
        await navigate(`/search/movie/${id}`);
        movieDetailRefetch();
    };
    const clickedTv = async (id: number) => {
        await navigate(`/search/tv/${id}`);
        tvDetailRefetch();
    };

    return (
        <SearchContainer>
            <MovieListTitle>
                {t("search.movie")} '{keyword}'
            </MovieListTitle>
            <SearchList>
                {movieList?.results.map((movie) => (
                    <Box
                        layoutId={movie.id + "movie"}
                        variants={boxVariants}
                        key={movie.id}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        onClick={() => clickedMovie(movie.id)}
                    >
                        <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                        </Info>
                    </Box>
                ))}
            </SearchList>
            <Detail
                detail={
                    movieMatch
                        ? { ...movieDetail, videoType: "movies" }
                        : { ...tvDetail, videoType: "tv" }
                }
            ></Detail>
            <MovieListTitle>
                {t("search.tv")} '{keyword}'
            </MovieListTitle>
            <SearchList>
                {tvList?.results.map((tv) => (
                    <Box
                        layoutId={tv.id + "tv"}
                        variants={boxVariants}
                        key={tv.id}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                        onClick={() => clickedTv(tv.id)}
                    >
                        <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
                        </Info>
                    </Box>
                ))}
            </SearchList>
        </SearchContainer>
    );
}

export default Search;
