import { Route, Routes } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Exhibition from "./Components/Pages/Exhibition";
import Artworks from "./Components/Pages/Artworks";
import Sidebar from "./Components/Navigation/Sidebar";
import Grid from "@mui/material/Grid2";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import TopMenu from "./Components/Navigation/TopBar";

const App = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMuseums, setSelectedMuseums] = useState([]);

  return (
    <>
      <Grid container sx={{ width: "100%", zIndex: 1300 }}>
        <Routes>
          <Route
            element={
              <>
                <Sidebar
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedMuseums={selectedMuseums}
                  setSelectedMuseums={setSelectedMuseums}
                />
                <TopMenu />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/exhibition" element={<Exhibition />} />
            <Route
              path="/artworks"
              element={
                <Artworks
                  selectedCategories={selectedCategories}
                  selectedMuseums={selectedMuseums}
                />
              }
            />
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Grid>
    </>
  );
};

export default App;
