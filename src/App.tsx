import { Routes, Route } from "react-router-dom";
import Login from "./Login.tsx";
import Dashboard from "./Dashboard.tsx";

function App() {
    return (
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
