import { createContext, useContext, useState } from "react";
const CartContext = createContext();

function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  const totalCartCount = cartProducts.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  function handleAddOneProduct(productId) {
    setCartProducts((prev) => {
      const existingProduct = prev.find((product) => product.id === productId);

      if (existingProduct) {
        return prev.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        );
      }

      return [...prev, { id: productId, quantity: 1 }];
    });
  }

  function handleRemoveOneProduct(productId) {
    setCartProducts((prev) => {
      const existingProduct = prev.find((product) => product.id === productId);

      if (existingProduct) {
        return prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                quantity:
                  product.quantity > 1 ? Math.max(0, product.quantity - 1) : 1,
              }
            : product,
        );
      }

      return [...prev, { id: productId, quantity: 1 }];
    });
  }

  function handleRemoveProductFromCart(productId) {
    setCartProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
  }

  function handleAddCartProducts(newId, newQuantity) {
    setCartProducts((prev) => {
      const existingProduct = prev.find((product) => product.id === newId);

      if (existingProduct) {
        return prev.map((product) =>
          product.id === newId
            ? { ...product, quantity: product.quantity + newQuantity }
            : product,
        );
      }
      return [...prev, { id: newId, quantity: newQuantity }];
    });
  }

  return (
    <CartContext.Provider
      value={{
        totalCartCount: totalCartCount,
        onAddCartProducts: handleAddCartProducts,
        cartProducts: cartProducts,
        onAddOneProduct: handleAddOneProduct,
        onRemoveOneProduct: handleRemoveOneProduct,
        onRemoveProductFromCart: handleRemoveProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined)
    throw new Error("CartContext was used outside of the CartProvider");

  return context;
}

export { CartProvider, useCart };
