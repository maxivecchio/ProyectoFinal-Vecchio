import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProductContext = createContext();

import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDatabase } from "../../firebase/config";

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function getProducts() {
    const q = query(collection(firestoreDatabase, "products"));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    setProducts(docs);
    setProductsLoading(false);
  }

  useEffect(() => {
    getProducts();
  }, []);

  const getProductBySlug = async (slug) => {
    try {
      const q = query(
        collection(firestoreDatabase, "products"),
        where("slug", "==", slug)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("Error fetching product");
        return;
      }
      const docs = querySnapshot.docs.map((doc) => doc.data());
      return docs[0];
    } catch (error) {
      console.log("Error fetching product");
    }
  };

  const contextValue = {
    products,
    productsLoading,
    selectedProduct,
    getProductBySlug,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw Error("useProducts must be used within an ProductProvider");
  }
  return context;
};

export { ProductProvider, useProducts };
