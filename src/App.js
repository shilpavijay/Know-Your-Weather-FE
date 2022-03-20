import "./App.css";
import Login from "./Components/Login";
import Home from "./Components/Home";
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="" element={<Login />}></Route>
      <Route path="/home" element={<Home />}></Route>
    </Routes>
  );
}

export default App;
