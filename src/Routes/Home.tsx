import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
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

// const Slider = styled.div`
//     position: relative;
//     top: -100px;
// `;

// const Row = styled(motion.div)`
//     width: 100%;
//     display: grid;
//     grid-template-columns: repeat(6, 1fr);
//     gap: 10px;
//     margin-bottom: 5px;
//     position: absolute;
// `;

// const Box = styled(motion.div)<{ bgPhoto: string }>`
//     /* background-color: white; */
//     background-image: url(${(props) => props.bgPhoto});
//     background-size: cover;
//     background-position: center;
//     height: 200px;
//     position: relative;
//     font-size: 24px;
//     cursor: pointer;
//     &:first-child {
//         transform-origin: center left;
//     }
//     &:last-child {
//         transform-origin: center right;
//     }
// `;

// const rowVariants = {
//     hidden: {
//         x: window.outerWidth,
//     },
//     visible: {
//         x: 0,
//     },
//     exit: {
//         x: -window.outerWidth,
//     },
// };

// const boxVariants = {
//     normal: {
//         scale: 1,
//     },
//     hover: {
//         zIndex: 9999,
//         scale: 1.3,
//         y: -50,
//         transition: {
//             delay: 0.5,
//             duration: 0.3,
//         },
//     },
// };

// const infoVariants = {
//     hover: {
//         opacity: 1,
//     },
// };

// const Info = styled(motion.div)`
//     padding: 20px;
//     background-color: ${(props) => props.theme.black.lighter};
//     opacity: 0;
//     position: absolute;
//     width: 100%;
//     bottom: 0;
//     h4 {
//         text-align: center;
//         font-size: 18px;
//     }
// `;

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

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const { data, isLoading } = useQuery<IMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );
    // const [index, setIndex] = useState(0);
    // const [leaving, setLeaving] = useState(false);
    // const increaseIndex = () => {
    //     if (data) {
    //         if (leaving) return;
    //         toggleLeaving();
    //         const totalMovies = data?.results.length - 1;
    //         const maxIndex = Math.floor(totalMovies / offset) - 1;
    //         setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    //     }
    // };
    // const toggleLeaving = () => setLeaving((prev) => !prev);
    // const onBoxClicked = (movieId: number) => {
    //     navigate(`/movies/${movieId}`);
    // };
    const onOverlayClick = () => {
        navigate("/");
    };
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );

    console.log(clickedMovie);
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        // onClick={increaseIndex}
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider listData={data} />
                    {/* <Slider>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(
                                        offset * index,
                                        offset * index + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            variants={boxVariants}
                                            key={movie.id}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{ type: "tween" }}
                                            bgPhoto={makeImagePath(
                                                movie.backdrop_path,
                                                "w500"
                                            )}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider> */}
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                ></Overlay>
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId}
                                    style={{ top: scrollY.get() + 100 }}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie.backdrop_path,
                                                        "w500"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedMovie.title}
                                            </BigTitle>
                                            <BigOverview>
                                                {clickedMovie.overview}
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
