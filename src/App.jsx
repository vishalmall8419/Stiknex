import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Tools from "./Pages/Tools/Tools";
import Notebook from "./Pages/Notebook/Notebook";
import BuyMeACoffee from "./Pages/BuyMeACoffee/BuyMeACoffee";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/notebook" element={<Notebook />} />
      <Route path="/buy-me-a-coffee" element={<BuyMeACoffee />} />
    </Routes>
  );
};

export default App;