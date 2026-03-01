import { Routes, Route } from "react-router-dom";
import Login from "./Login.tsx";
import Dashboard from "./Dashboard.tsx";
import Sample from "./Sample.tsx";

function App() {
    return (
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sample" element={<Sample/>}/>
        {/* You can add more routes later */}
        </Routes>
    );
}

export default App;
