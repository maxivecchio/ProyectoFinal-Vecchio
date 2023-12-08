import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
import { useNotifications } from "./NotificationContext";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    itemsTotal: 0,
    email: null,
    orderDetails: {
      shippingAddress: {
        first_name: null,
        last_name: null,
        address_1: null,
        address_2: null,
        city: null,
        province: null,
        country_code: "ar",
        postal_code: null,
        phone: null,
      },
      billingAddress: {
        first_name: null,
        last_name: null,
        address_1: null,
        address_2: null,
        city: null,
        province: null,
        country_code: null,
        postal_code: null,
        phone: null,
      },
      payment: {
        name_on_card: null,
        card_number: null,
        exp_month: null,
        exp_year: null,
        cvc: null,
        last4digits: null,
      },
    },
  });

  const [fetchingCart, setFetchingCart] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setFetchingCart(false);
  }, []);

  useEffect(() => {
    if (!fetchingCart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    const newTotal = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const newItemsTotal = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    setCart((currentCart) => ({
      ...currentCart,
      total: newTotal,
      itemsTotal: newItemsTotal,
    }));
  }, [cart.items]);

  const isStockAvailable = (product, quantity) => {
    return quantity <= product.stock;
  };

  const addToCart = (product, quantityToAdd) => {
    setCart((currentCart) => {
      const productIndex = currentCart.items.findIndex(
        (item) => item.product.slug === product.slug
      );

      if (productIndex > -1) {
        const existingItem = currentCart.items[productIndex];
        const totalQuantity = existingItem.quantity + quantityToAdd;

        if (!isStockAvailable(product, totalQuantity)) {
          addNotification({
            id: new Date().getTime(),
            message: "No sufficient stock for the requested quantity.",
          });

          return currentCart;
        }

        const newItems = currentCart.items.map((item, index) => {
          if (index === productIndex) {
            return { ...item, quantity: totalQuantity };
          }
          return item;
        });

        return { ...currentCart, items: newItems };
      } else {
        if (!isStockAvailable(product, quantityToAdd)) {
          addNotification({
            id: new Date().getTime(),
            message: "No sufficient stock for the requested quantity.",
          });
          return currentCart;
        }

        const newItem = { product, quantity: quantityToAdd };
        return { ...currentCart, items: [...currentCart.items, newItem] };
      }
    });
  };

  const updateQuantity = (productSlug, newQuantity) => {
    setCart((currentCart) => {
      const productIndex = currentCart.items.findIndex(
        (item) => item.product.slug === productSlug
      );

      if (productIndex === -1 || newQuantity <= 0) {
        return {
          ...currentCart,
          items: currentCart.items.filter(
            (item) => item.product.slug !== productSlug
          ),
        };
      }

      const product = currentCart.items[productIndex].product;

      if (!isStockAvailable(product, newQuantity)) {
        addNotification({
          id: new Date().getTime(),
          message: "No sufficient stock for the requested quantity.",
        });
        return currentCart;
      }

      const newItems = currentCart.items.map((item, index) => {
        if (index === productIndex) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      return { ...currentCart, items: newItems };
    });
  };

  const removeFromCart = (productSlug) => {
    setCart((currentCart) => {
      const newItems = currentCart.items.filter(
        (item) => item.product.slug !== productSlug
      );
      return { ...currentCart, items: newItems };
    });
  };

  const contextValue = {
    cart,
    setCart,
    fetchingCart,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
