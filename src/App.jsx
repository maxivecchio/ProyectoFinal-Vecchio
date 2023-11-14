import NavigationBar from "./components/Navbar";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Error404 from './pages/Error404'
import ItemView from "./components/ItemView";


const obtenerProductos = () => {
  return new Promise((resolve, reject) => {
    const productos = [
      {
        id: "128844fb-efb1-4e38-bf7b-cac891c7751b",
        name: "Buzo Brand Lime",
        slug: "buzo-brand-lime",
        img: "https://acdn.mitiendanube.com/stores/219/431/products/eebb4212-fde7-4657-8407-3eace0e46294-1ef36b6a74628f23a916993755280277-480-0.webp",
        price: 63990,
      },
      {
        id: "ece0271e-1bf6-4f2c-afd9-b8396b4beaa1",
        name: "Remeron Verified White",
        slug: "remeron-verified-white",
        img: "https://acdn.mitiendanube.com/stores/219/431/products/dbb1ec55-005b-4240-8f67-78fc5de7b01a-82ee3f989a00ccc3d516994795871612-480-0.webp",
        price: 32990,
      },
      {
        id: "8aa1aec3-762e-47af-88b0-50b2ca70b52e",
        name: "Camisa Monogram",
        slug: "camisa-monogram",
        img: "https://acdn.mitiendanube.com/stores/219/431/products/92a2854f-359e-4e55-8903-67a52a19b8ed-b89d4c040843bdee5616990214194944-480-0.webp",
        price: 40990,
      },
      {
        id: "e3f72d3a-7c8d-4ec5-85a4-4e66410dab1b",
        name: "Remeron Gorillaz",
        slug: "remeron-gorillaz",
        img: "https://acdn.mitiendanube.com/stores/219/431/products/4562c9c8-0204-4421-877c-23a45af2af69-71fb02845e14181b9f16990212918984-480-0.webp",
        price: 33990,
      },
    ];
    setTimeout(() => {
      resolve(productos);
    }, 1000);
  });
};

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    obtenerProductos().then((data) => {
      setData(data);
    });
  }, []);
  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home productos={data} />} />
          <Route path="/producto/:slug" element={<ItemView productos={data} />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
