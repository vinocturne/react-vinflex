import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { IMoviesResult } from "../api";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { listData } from "../atoms";

const SliderList = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-bottom: 5px;
    position: absolute;
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

const rowVariants = {
    hidden: {
        x: window.outerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        zIndex: 9999,
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
    },
};

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

const offset = 6;

function Slider({ listData }: any) {
    // function Slider(listData: IMoviesResult) {
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const navigate = useNavigate();
    const onBoxClicked = (movieId: number) => {
        console.log(movieId + listData.type);
        navigate(`/movies/${listData.type}/${movieId}`);
    };
    // console.log(listData);
    // const movieData = useRecoilValue(listData);
    return (
        <SliderList>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                >
                    {listData?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((movie: any) => (
                            <Box
                                layoutId={movie.id + listData.type}
                                variants={boxVariants}
                                key={movie.id}
                                initial="normal"
                                whileHover="hover"
                                transition={{ type: "tween" }}
                                bgphoto={makeImagePath(
                                    movie.backdrop_path,
                                    "w500"
                                )}
                                onClick={() => onBoxClicked(movie.id)}
                            >
                                <Info variants={infoVariants}>
                                    <h4>{movie.title}</h4>
                                </Info>
                            </Box>
                        ))}
                </Row>
            </AnimatePresence>
        </SliderList>
    );
}

export default Slider;
