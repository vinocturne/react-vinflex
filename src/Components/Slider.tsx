import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { useNavigate, useLocation } from "react-router-dom";
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
    hidden: (back: boolean) => ({
        x: back ? -window.outerWidth : window.outerWidth,
    }),
    visible: {
        x: 0,
    },
    exit: (back: boolean) => ({
        x: back ? window.outerWidth : -window.outerWidth,
    }),
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

const PrevButton = styled.div`
    z-index: 99999;
    position: absolute;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 28px;
    font-weight: 500;
    cursor: pointer;
`;

const NextButton = styled.div`
    cursor: pointer;
    z-index: 99999;
    position: absolute;
    right: 0;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 28px;
    font-weight: 500;
`;

const offset = 6;

function Slider(props: any) {
    const [key, setKey] = useState(0);
    const [index, setIndex] = useState(0);
    const [back, setBack] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const navigate = useNavigate();
    const location = useLocation();
    const onBoxClicked = async (id: number) => {
        switch (location.pathname) {
            case "/":
                await navigate(`/movies/${props.listData.type}/${id}`);
                break;
            case "/tv":
                await navigate(`/tv/${props.listData.type}/${id}`);
        }
        props.clicked();
    };
    const increaseIndex = () => {
        setBack(false);
        if (props.listData) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = props.listData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const decreaseIndex = () => {
        setBack(true);
        if (props.listData) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = props.listData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
        console.log(index);
    };
    return (
        <SliderList>
            <AnimatePresence
                initial={false}
                custom={back}
                onExitComplete={toggleLeaving}
            >
                <PrevButton onClick={decreaseIndex}> &lt; </PrevButton>
                <Row
                    variants={rowVariants}
                    custom={back}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                >
                    {listData &&
                        props.listData?.results
                            .slice(1)
                            .slice(offset * index, offset * index + offset)
                            .map((movie: any) => (
                                <Box
                                    layoutId={movie.id + props.listData.type}
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
                                        <h4>
                                            {movie.title
                                                ? movie.title
                                                : movie.name}
                                        </h4>
                                    </Info>
                                </Box>
                            ))}
                </Row>
                <NextButton onClick={increaseIndex}>&gt;</NextButton>
            </AnimatePresence>
        </SliderList>
    );
}

export default Slider;
