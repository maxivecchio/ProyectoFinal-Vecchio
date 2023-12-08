import NavigationBar from "./components/Navbar";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ItemView from "./components/ItemView";
import Toast from "./components/Toast";
import SuccessPage from "./pages/SuccessPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toast />
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ItemView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
