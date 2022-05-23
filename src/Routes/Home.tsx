import { useQuery } from "react-query";
import styled from "styled-components";
import {
    getMovieDetail,
    getMovies,
    getPopularMovies,
    IMovieDetail,
    IMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useLocation, useMatch } from "react-router-dom";
import Slider from "../Components/Slider";
import Detail from "../Components/Detail";
import { useTranslation } from "react-i18next";

const Wrapper = styled.div`
    background-color: black;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    padding: 60px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
    justify-content: center;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 28px;
    width: 50%;
`;

const MovieListContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-rows: 350px 350px;
`;
const NowPlayingContainer = styled.div`
    display: block;
`;
const PopularPlayingContainer = styled.div`
    display: block;
`;
const SlideTitle = styled.div`
    font-size: 32px;
    position: relative;
    bottom: 115px;
    padding-left: 45px;
    padding-right: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
    background: linear-gradient(to right, black 70%, transparent);
    width: fit-content;
    color: ${(props) => props.theme.white.lighter};
`;

function Home() {
    const { t } = useTranslation();
    const location = useLocation();
    const bigMovieMatch = useMatch("/movies/:type/:id");
    const { data: nowPlaying, isLoading: isNowPlayingLoading } = useQuery<
        IMoviesResult
    >(["movies", "nowPlaying"], getMovies);
    const { data: popular, isLoading: isPopularLoading } = useQuery<
        IMoviesResult
    >(["movies", "popular"], getPopularMovies);
    const {
        data: movieDetail,
        isLoading: isDetailLoading,
        refetch: detailRefetch,
    } = useQuery<IMovieDetail>(
        ["detail", bigMovieMatch?.params.id && bigMovieMatch?.params.id],
        getMovieDetail,
        { enabled: false }
    );

    // const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    // };

    const clickedMovie = () => {
        detailRefetch();
    };

    return (
        <Wrapper>
            {isNowPlayingLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(
                            nowPlaying?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{nowPlaying?.results[0].title}</Title>
                        <Overview>{nowPlaying?.results[0].overview}</Overview>
                    </Banner>
                    <MovieListContainer>
                        {!isNowPlayingLoading ? (
                            <NowPlayingContainer>
                                <SlideTitle>{t("home.nowPlaying")}</SlideTitle>
                                <Slider
                                    listData={{
                                        ...nowPlaying,
                                        type: "nowPlaying",
                                    }}
                                    clicked={clickedMovie}
                                />
                            </NowPlayingContainer>
                        ) : null}
                        {!isPopularLoading ? (
                            <PopularPlayingContainer>
                                <SlideTitle>{t("home.popular")}</SlideTitle>
                                <Slider
                                    listData={{ ...popular, type: "popular" }}
                                    clicked={clickedMovie}
                                />
                            </PopularPlayingContainer>
                        ) : null}
                    </MovieListContainer>
                    {!isDetailLoading ? (
                        <Detail
                            detail={{
                                ...movieDetail,
                                videoType: location.pathname.split("/")[1],
                            }}
                        ></Detail>
                    ) : null}
                </>
            )}
        </Wrapper>
    );
}

export default Home;
