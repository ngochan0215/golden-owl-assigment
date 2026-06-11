import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ScoreLookup from "./pages/ScoreLookup";
import Report from "./pages/Report";
import Top10 from "./pages/Top10";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<ScoreLookup />}></Route>
                <Route path="/report" element={<Report />}></Route>
                <Route path="/top10" element={<Top10 />}></Route>
            </Routes>
        </BrowserRouter>
    );
}