import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
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
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

function Detail({ detail }: any) {
    const { id, type } = useParams();
    const { scrollY } = useViewportScroll();
    const navigate = useNavigate();
    const onOverlayClick = () => {
        navigate(-1);
    };
    const checkLayoutId = () => {
        const layoutId = String(id) + String(type);
        return layoutId;
    };
    console.log(detail);
    return (
        <AnimatePresence>
            {id ? (
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
                        {detail && (
                            <>
                                <BigCover
                                    style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                            detail.backdrop_path,
                                            "w500"
                                        )})`,
                                    }}
                                />
                                <BigTitle>
                                    {detail.videoType === "movies"
                                        ? detail.title
                                        : detail.name}
                                </BigTitle>
                                <BigOverview>{detail.overview}</BigOverview>
                            </>
                        )}
                    </BigMovie>
                </>
            ) : null}
        </AnimatePresence>
    );
}

export default Detail;
