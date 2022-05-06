import { atom } from "recoil";
import { IMoviesResult } from "./api";

export const listData = atom<IMoviesResult>({
    key: "listData",
    default: {
        dates: {
            maximum: "",
            minimum: "",
        },
        page: 0,
        results: [],
        total_pages: 0,
        total_results: 0,
    },
});
