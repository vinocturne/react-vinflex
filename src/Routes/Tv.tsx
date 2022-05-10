import { useQuery } from "react-query";
import styled from "styled-components";
import {
    getPopularTvs,
    getTvDetail,
    getTvs,
    ITvDetail,
    ITvResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useLocation, useMatch } from "react-router-dom";
import Slider from "../Components/Slider";
import Detail from "../Components/Detail";

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
const TvListContainer = styled.div`
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

function Tv() {
    const location = useLocation();
    const bigTvMatch = useMatch("/tv/:type/:id");
    const { data: nowPlaying, isLoading: isNowPlayingLoading } = useQuery<
        ITvResult
    >(["tvs", "onTheAir"], getTvs);
    const { data: popular, isLoading: isPopularLoading } = useQuery<ITvResult>(
        ["tvs", "popular"],
        getPopularTvs
    );
    const {
        data: tvDetail,
        isLoading: isDetailLoading,
        refetch: detailRefetch,
    } = useQuery<ITvDetail>(
        ["detail", bigTvMatch?.params.id && bigTvMatch?.params.id],
        getTvDetail,
        { enabled: false }
    );
    const clickedTv = () => {
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
                        <Title>{nowPlaying?.results[0].name}</Title>
                        <Overview>{nowPlaying?.results[0].overview}</Overview>
                    </Banner>
                    <TvListContainer>
                        {!isNowPlayingLoading ? (
                            <NowPlayingContainer>
                                <SlideTitle>Now Playing</SlideTitle>
                                <Slider
                                    listData={{
                                        ...nowPlaying,
                                        type: "nowPlaying",
                                    }}
                                    clicked={clickedTv}
                                />
                            </NowPlayingContainer>
                        ) : null}
                        {!isPopularLoading ? (
                            <PopularPlayingContainer>
                                <SlideTitle>Popular</SlideTitle>
                                <Slider
                                    listData={{ ...popular, type: "popular" }}
                                    clicked={clickedTv}
                                />
                            </PopularPlayingContainer>
                        ) : null}
                    </TvListContainer>
                    {!isDetailLoading ? (
                        <Detail
                            detail={{
                                ...tvDetail,
                                videoType: location.pathname.split("/")[1],
                            }}
                        ></Detail>
                    ) : null}
                </>
            )}
        </Wrapper>
    );
}

export default Tv;
