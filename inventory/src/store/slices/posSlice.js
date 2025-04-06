import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [], // Ensure cart is always initialized as an array
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.cart.find(
        (item) => item.ProductID === action.payload.ProductID
      );
      if (existingProduct) {
        existingProduct.ProductQuantity += 1; // Increase quantity if item exists
      } else {
        state.cart.push({ ...action.payload, ProductQuantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.ProductID !== action.payload
      );
    },
    updateQuantity: (state, action) => {
      const item = state.cart.find(
        (item) => item.ProductID === action.payload.ProductID
      );
      if (item) {
        item.ProductQuantity = action.payload.ProductQuantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  posSlice.actions;
export default posSlice.reducer;
