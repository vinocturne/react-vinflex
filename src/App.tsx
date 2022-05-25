import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            {/* <Router> */}
            <Header />
            <Routes>
                <Route path="/tv" element={<Tv />}></Route>
                <Route path="/tv/:type/:id" element={<Tv />}></Route>
                <Route path="/search" element={<Search />}></Route>
                <Route path="/search/:type/:id" element={<Search />}></Route>
                <Route path="/movies/:type/:id" element={<Home />}></Route>
                <Route path="/*" element={<Home />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
