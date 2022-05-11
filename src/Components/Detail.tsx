import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import starFull from "../assets/images/star-full.png";
import { IGenres } from "../api";
const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const Movie = styled(motion.div)`
    z-index: 999999;
    position: fixed;
    width: 40vw;
    height: auto;
    top: 100px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
`;

const Cover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    top: -110px;
`;
const Title = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 40px;
`;
const Rating = styled.div`
    padding: 10px;
    img {
        width: 100px;
        height: 100px;
        position: relative;
        bottom: 20px;
    }
`;
const RatingScore = styled.span`
    position: absolute;
    width: 30px;
    color: black;
    right: 46px;
    top: 35px;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
`;

const Overview = styled.p`
    position: relative;
    padding: 20px;
    font-size: 18px;
    top: -120px;
    color: ${(props) => props.theme.white.lighter};
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`;
const Genres = styled.div``;
const Info = styled.div``;
const GenresTitle = styled.span`
    font-size: 22px;
    font-weight: 500;
`;
const InfoTitle = styled.span`
    font-size: 22px;
    font-weight: 500;
`;

function Detail({ detail }: any) {
    const { id, type } = useParams();
    const navigate = useNavigate();
    const onOverlayClick = () => {
        navigate(-1);
    };
    const checkLayoutId = () => {
        const layoutId = String(id) + String(type);
        return layoutId;
    };
    return (
        <AnimatePresence>
            {id ? (
                <>
                    <Overlay
                        onClick={onOverlayClick}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    ></Overlay>
                    <Movie layoutId={checkLayoutId()} exit={{ zIndex: 999999 }}>
                        {detail && (
                            <>
                                <Cover
                                    style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                            detail.backdrop_path,
                                            "w500"
                                        )})`,
                                    }}
                                />
                                <Header>
                                    <Title>
                                        {detail.videoType === "movies"
                                            ? detail.title
                                            : detail.name}
                                    </Title>
                                    <Rating>
                                        <img src={starFull} alt="rating" />
                                        <RatingScore>
                                            {detail?.vote_average}
                                        </RatingScore>
                                    </Rating>
                                </Header>
                                <Overview>{detail?.overview}</Overview>
                                <InfoContainer>
                                    <Genres>
                                        {detail?.genres?.length != 0 ? (
                                            <GenresTitle>Genres</GenresTitle>
                                        ) : null}
                                        {detail?.genres?.map(
                                            (genre: IGenres) => (
                                                <div>{genre.name}</div>
                                            )
                                        )}
                                    </Genres>
                                    {detail?.videoType === "movies" ? (
                                        <Info>
                                            <InfoTitle>Info.</InfoTitle>
                                            <div>
                                                <div>
                                                    Runtime : {detail?.runtime}
                                                </div>
                                                <div>
                                                    Release Date :
                                                    {detail?.release_date}
                                                </div>
                                            </div>
                                        </Info>
                                    ) : null}
                                </InfoContainer>
                            </>
                        )}
                    </Movie>
                </>
            ) : null}
        </AnimatePresence>
    );
}

export default Detail;