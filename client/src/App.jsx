import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            
          </Route>
          <Route
              path="/login"
              element={<h1>I am the login page of this app</h1>}
            />
        </Routes>
      </BrowserRouter>
    </>
  );
}
