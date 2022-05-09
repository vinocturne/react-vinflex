import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
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
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import Slider from "../Components/Slider";

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

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 40px;
    position: relative;
    top: -75px;
`;

const BigOverview = styled.p`
    position: relative;
    padding: 20px;
    top: -75px;
    color: ${(props) => props.theme.white.lighter};
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
    const navigate = useNavigate();
    const location = useLocation();
    const bigMovieMatch = useMatch("/movies/:type/:id");

    const { scrollY } = useViewportScroll();
    const { data: nowPlaying, isLoading: isNowPlayingLoading } = useQuery<
        IMoviesResult
    >(["movies", "nowPlaying"], getMovies);
    const { data: popular, isLoading: isPopularLoading } = useQuery<
        IMoviesResult
    >(["movies", "popular"], getPopularMovies);
    const onOverlayClick = () => {
        navigate("/");
    };

    const {
        data: movieDetail,
        isLoading: isDetailLoading,
        refetch: detailRefetch,
    } = useQuery<IMovieDetail>(
        ["detail", bigMovieMatch?.params.id && bigMovieMatch?.params.id],
        getMovieDetail
    );

    const clickedMovie = async () => {
        await detailRefetch();
    };

    const checkLayoutId = () => {
        const id = bigMovieMatch?.params.id;
        const type = bigMovieMatch?.params.type;
        const layoutId = String(id) + String(type);
        return layoutId;
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
                        <NowPlayingContainer>
                            <SlideTitle>Now Playing</SlideTitle>
                            <Slider
                                listData={{ ...nowPlaying, type: "nowPlaying" }}
                                clicked={clickedMovie}
                            />
                        </NowPlayingContainer>
                        <PopularPlayingContainer>
                            <SlideTitle>Popular</SlideTitle>
                            <Slider
                                listData={{ ...popular, type: "popular" }}
                                clicked={clickedMovie}
                            />
                        </PopularPlayingContainer>
                    </MovieListContainer>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                ></Overlay>
                                <BigMovie
                                    layoutId={checkLayoutId()}
                                    style={{ top: scrollY.get() + 100 }}
                                >
                                    {movieDetail && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        movieDetail.backdrop_path,
                                                        "w500"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {movieDetail.title}
                                            </BigTitle>
                                            <BigOverview>
                                                {movieDetail.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
