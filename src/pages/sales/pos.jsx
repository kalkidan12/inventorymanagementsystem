// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { CameraIcon, Plus, Minus, X } from "lucide-react";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import { useRouter } from "next/router";
// import { logout } from "@/store/slices/authSlice";

// import {
//   addToCart,
//   removeFromCart,
//   updateQuantity,
//   clearCart,
// } from "@/store/slices/posSlice";
// import {
//   useLazyGetProductByBarcodeQuery,
//   useProcessSaleMutation,
// } from "@/store/api/salesApiSlice";

// const LOCAL_CART_KEY = "pos_cart_data";

// const POS = () => {
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.pos.cart || []);
//   const barcodeInputRef = useRef();

//   const [isAuthorized, setIsAuthorized] = useState(false);

//   const [barcode, setBarcode] = useState("");
//   const [scannerActive, setScannerActive] = useState(false);
//   const [checkedPrice, setCheckedPrice] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [triggerFetchProduct] = useLazyGetProductByBarcodeQuery();
//   const [processSale, { isLoading: isProcessing }] = useProcessSaleMutation();

//   const router = useRouter();

//   useEffect(() => {
//     const savedCart = localStorage.getItem(LOCAL_CART_KEY);
//     if (savedCart) {
//       const parsed = JSON.parse(savedCart);
//       parsed.forEach((item) => {
//         dispatch(addToCart(item));
//       });
//     }
//     barcodeInputRef.current?.focus();
//   }, [dispatch]);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       router.replace("/");
//     } else {
//       setIsAuthorized(true); // Only show the page when token exists
//     }

//     // Prevent back navigation
//     const disableNav = () => {
//       window.history.pushState(null, "", window.location.href);
//     };

//     disableNav();
//     window.addEventListener("popstate", disableNav);

//     const preventKeyNav = (e) => {
//       if (
//         (e.altKey && e.key === "ArrowLeft") ||
//         (e.key === "Backspace" &&
//           !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
//       ) {
//         e.preventDefault();
//       }
//     };
//     window.addEventListener("keydown", preventKeyNav);

//     return () => {
//       window.removeEventListener("popstate", disableNav);
//       window.removeEventListener("keydown", preventKeyNav);
//     };
//   }, [router]);

//   useEffect(() => {
//     localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     let scanner;

//     if (scannerActive) {
//       const config = { fps: 10, qrbox: { width: 250, height: 250 } };
//       scanner = new Html5QrcodeScanner("reader", config, false);

//       scanner.render(
//         async (decodedText) => {
//           if (decodedText) {
//             await handleFetchProduct(decodedText);
//             setScannerActive(false);
//             scanner.clear().catch(console.error);
//           }
//         },
//         (err) => console.warn("QR Error", err)
//       );
//     }

//     return () => {
//       if (scanner) {
//         scanner.clear().catch(console.error);
//       }
//     };
//   }, [scannerActive]);

//   const handleFetchProduct = async (barcodeInput) => {
//     try {
//       const res = await triggerFetchProduct(barcodeInput);
//       const product = res?.data;

//       if (!product || !product._id) {
//         alert("Product doesn't exist for your company.");
//         return;
//       }

//       const ProductID = product._id;
//       const existingItem = cart.find((item) => item.ProductID === ProductID);

//       if (existingItem) {
//         dispatch(
//           updateQuantity({
//             ProductID,
//             ProductQuantity: existingItem.ProductQuantity + 1,
//           })
//         );
//       } else {
//         dispatch(addToCart({ ...product, ProductID, ProductQuantity: 1 }));
//       }
//     } catch (err) {
//       console.error("Product fetch error:", err);
//       alert(
//         err?.data?.message ||
//           "Failed to fetch product. It may not exist or belongs to another company."
//       );
//     }
//   };

//   const handleAddToCart = () => {
//     if (!barcode.trim()) return;
//     handleFetchProduct(barcode.trim());
//     setBarcode("");
//     setCheckedPrice(null);
//     barcodeInputRef.current?.focus();
//   };

//   const handleCheckPrice = async () => {
//     if (!barcode.trim()) return;
//     try {
//       const res = await triggerFetchProduct(barcode);
//       const product = res?.data;
//       if (!product || !product._id) return;

//       const price = product.ProductPrice;
//       const taxRate = product.ProductTax || 0;
//       const taxAmount = (price * taxRate) / 100;
//       const totalWithTax = (price + taxAmount).toFixed(2);

//       setCheckedPrice(`${totalWithTax} Birr`);
//     } catch (err) {
//       setCheckedPrice(null);
//     }
//   };

//   const handleProcessSale = async () => {
//     if (cart.length === 0) return alert("Cart is empty");

//     const salesItems = cart.map((item) => ({
//       product: item.ProductID,
//       productName: item.ProductName,
//       productBarcode: item.ProductBarcode,
//       quantitySold: item.ProductQuantity,
//       pricePerUnit: item.ProductPrice, // base price without tax
//     }));

//     try {
//       await processSale({ salesItems }).unwrap();
//       dispatch(clearCart());
//       localStorage.removeItem(LOCAL_CART_KEY);
//       alert("Sale processed successfully");
//     } catch (err) {
//       console.error(err);
//       alert(err?.data?.message || "Failed to process sale");
//     }
//   };

//   const updateItemQuantity = (ProductID, newQty) => {
//     if (newQty > 0) {
//       dispatch(updateQuantity({ ProductID, ProductQuantity: newQty }));
//     }
//   };

//   const totalQuantity = cart.reduce(
//     (sum, item) => sum + item.ProductQuantity,
//     0
//   );

//   const calculateTaxInclusiveTotal = () => {
//     return cart
//       .reduce((sum, item) => {
//         const tax = (item.ProductPrice * (item.ProductTax || 0)) / 100;
//         const priceWithTax = item.ProductPrice + tax;
//         return sum + priceWithTax * item.ProductQuantity;
//       }, 0)
//       .toFixed(2);
//   };

//   const totalPrice = calculateTaxInclusiveTotal();

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.clear();
//     router.replace("/auth/login");
//   };

//   if (!isAuthorized) {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-gray-600 text-sm animate-pulse">
//           Checking authentication...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-tr from-gray-50 to-blue-50 min-h-screen font-sans">
//       {/* Header */}
//       <header className="w-full px-4 py-3 bg-[#0F172A] text-white shadow flex justify-between items-center mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
//           Kaliget POS
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="bg-yellow-400 text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-200"
//         >
//           Logout
//         </button>
//       </header>

//       {/* POS Container */}
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
//         <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
//           Point of Sale (POS)
//         </h2>

//         {/* Barcode Input & Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="md:col-span-3">
//             <label className="text-sm font-medium text-gray-700 mb-1 block">
//               Barcode
//             </label>
//             <div className="relative">
//               <input
//                 ref={barcodeInputRef}
//                 type="text"
//                 value={barcode}
//                 onChange={(e) => setBarcode(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleAddToCart()}
//                 placeholder="Scan or enter barcode"
//                 className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 transition"
//               />
//               <button
//                 onClick={() => setScannerActive(true)}
//                 className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
//               >
//                 <CameraIcon size={22} />
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col justify-end gap-2">
//             <button
//               onClick={handleAddToCart}
//               className="bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 transition-all font-semibold"
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleCheckPrice}
//               className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-all font-semibold"
//             >
//               Check Price
//             </button>
//             {checkedPrice && (
//               <div className="text-center text-sm font-medium text-green-600 mt-1">
//                 Price (incl. tax): {checkedPrice}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Scanner Modal */}
//         {scannerActive && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
//               <p className="text-center text-lg font-semibold mb-3">
//                 Scan Barcode
//               </p>
//               <div id="reader" className="w-64 h-64 my-2 mx-auto"></div>
//               <button
//                 onClick={() => setScannerActive(false)}
//                 className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Cart Table */}
//         <div className="overflow-x-auto border rounded-lg bg-gray-50 p-4 mt-4">
//           <table className="w-full min-w-[800px] text-sm">
//             <thead>
//               <tr className="bg-blue-100 text-gray-700">
//                 <th className="p-2 text-left">Image</th>
//                 <th className="p-2 text-left">Barcode</th>
//                 <th className="p-2 text-left">Name</th>
//                 <th className="p-2 text-left">Tax %</th>
//                 <th className="p-2 text-left">Base Price</th>
//                 <th className="p-2 text-left">Price w/ Tax</th>
//                 <th className="p-2 text-left">Qty</th>
//                 <th className="p-2 text-left">Total</th>
//                 <th className="p-2 text-left">Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cart.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="text-center p-4 text-gray-500">
//                     Cart is empty
//                   </td>
//                 </tr>
//               ) : (
//                 cart.map((item) => {
//                   const tax =
//                     (item.ProductPrice * (item.ProductTax || 0)) / 100;
//                   const totalWithTax =
//                     (item.ProductPrice + tax) * item.ProductQuantity;

//                   return (
//                     <tr
//                       key={item.ProductID}
//                       className="border-t bg-white hover:bg-gray-100 transition"
//                     >
//                       <td
//                         className="p-2 cursor-pointer"
//                         onClick={() => setImagePreview(item.ProductImage)}
//                       >
//                         <img
//                           src={item.ProductImage}
//                           alt={item.ProductName}
//                           className="w-10 h-10 rounded object-cover"
//                         />
//                       </td>
//                       <td className="p-2">{item.ProductBarcode}</td>
//                       <td className="p-2">{item.ProductName}</td>
//                       <td className="p-2">{item.ProductTax}</td>
//                       <td className="p-2">{item.ProductPrice.toFixed(2)}</td>
//                       <td className="p-2">
//                         {(item.ProductPrice + tax).toFixed(2)}
//                       </td>
//                       <td className="p-2">
//                         <div className="flex items-center gap-1">
//                           <button
//                             onClick={() =>
//                               updateItemQuantity(
//                                 item.ProductID,
//                                 item.ProductQuantity - 1
//                               )
//                             }
//                             className="bg-gray-200 px-2 rounded hover:bg-gray-300"
//                           >
//                             <Minus size={14} />
//                           </button>
//                           <span className="px-2">{item.ProductQuantity}</span>
//                           <button
//                             onClick={() =>
//                               updateItemQuantity(
//                                 item.ProductID,
//                                 item.ProductQuantity + 1
//                               )
//                             }
//                             className="bg-gray-200 px-2 rounded hover:bg-gray-300"
//                           >
//                             <Plus size={14} />
//                           </button>
//                         </div>
//                       </td>
//                       <td className="p-2 font-semibold text-gray-700">
//                         {totalWithTax.toFixed(2)}
//                       </td>
//                       <td className="p-2">
//                         <button
//                           onClick={() =>
//                             dispatch(removeFromCart(item.ProductID))
//                           }
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                         >
//                           ✕
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Totals + Action */}
//         <div className="flex flex-col md:flex-row justify-between mt-6 text-lg font-semibold gap-2 text-blue-800">
//           <p>Total Quantity: {totalQuantity}</p>
//           <p>Total Price (Including Tax): {totalPrice} Birr</p>
//         </div>

//         <button
//           onClick={handleProcessSale}
//           disabled={isProcessing}
//           className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {isProcessing ? "Processing..." : "Process Sale"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default POS;

// pages/sales/pos.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CameraIcon, Plus, Minus } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { logout } from "@/store/slices/authSlice";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/posSlice";
import {
  useLazyGetProductByBarcodeQuery,
  useProcessSaleMutation,
} from "@/store/api/salesApiSlice";

const LOCAL_CART_KEY = "pos_cart_data";

const POS = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state) => state.pos.cart || []);
  const barcodeInputRef = useRef();

  const [barcode, setBarcode] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [checkedPrice, setCheckedPrice] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [triggerFetchProduct] = useLazyGetProductByBarcodeQuery();
  const [processSale, { isLoading: isProcessing }] = useProcessSaleMutation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }

    const blockNav = () => {
      window.history.pushState(null, "", window.location.href);
    };

    blockNav();
    window.addEventListener("popstate", blockNav);
    window.addEventListener("keydown", (e) => {
      if (
        (e.altKey && e.key === "ArrowLeft") ||
        (e.key === "Backspace" &&
          !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
      ) {
        e.preventDefault();
      }
    });

    return () => {
      window.removeEventListener("popstate", blockNav);
    };
  }, [router]);

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_CART_KEY);
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      parsed.forEach((item) => dispatch(addToCart(item)));
    }
    barcodeInputRef.current?.focus();
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let scanner;
    if (scannerActive) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(
        async (decodedText) => {
          if (decodedText) {
            await handleFetchProduct(decodedText.trim(), true);
            setScannerActive(false);
            scanner.clear().catch(console.error);
          }
        },
        (err) => console.warn("QR Error", err)
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scannerActive]);

  const handleFetchProduct = async (inputBarcode, isScanner = false) => {
    try {
      const res = await triggerFetchProduct(inputBarcode);
      const product = res?.data;

      if (!product || !product._id) {
        toast.error("❌ Product doesn't exist for your company.");
        return;
      }

      const ProductID = product._id;
      const existingItem = cart.find((item) => item.ProductID === ProductID);

      if (existingItem) {
        dispatch(
          updateQuantity({
            ProductID,
            ProductQuantity: existingItem.ProductQuantity + 1,
          })
        );
      } else {
        dispatch(addToCart({ ...product, ProductID, ProductQuantity: 1 }));
      }

      toast.success(`✅ ${product.ProductName} added to cart.`);
    } catch (err) {
      toast.error("❌ Product not found or belongs to another company.");
    }
  };

  const handleAddToCart = () => {
    if (!barcode.trim()) return;
    handleFetchProduct(barcode.trim());
    setBarcode("");
    setCheckedPrice(null);
    barcodeInputRef.current?.focus();
  };

  const handleCheckPrice = async () => {
    if (!barcode.trim()) return;
    try {
      const res = await triggerFetchProduct(barcode.trim());
      const product = res?.data;
      if (!product || !product._id) {
        setCheckedPrice(null);
        toast.error("❌ Product not found.");
        return;
      }

      const tax = (product.ProductPrice * (product.ProductTax || 0)) / 100;
      const totalWithTax = (product.ProductPrice + tax).toFixed(2);

      setCheckedPrice(`${totalWithTax} Birr`);
      toast.info(`💰 ${product.ProductName} price: ${totalWithTax} Birr`);
    } catch (err) {
      setCheckedPrice(null);
      toast.error("❌ Unable to check price.");
    }
  };

  const handleProcessSale = async () => {
    if (cart.length === 0) return toast.warning("🛒 Cart is empty");

    const salesItems = cart.map((item) => ({
      product: item.ProductID,
      productName: item.ProductName,
      productBarcode: item.ProductBarcode,
      quantitySold: item.ProductQuantity,
      pricePerUnit: item.ProductPrice,
    }));

    try {
      await processSale({ salesItems }).unwrap();
      dispatch(clearCart());
      localStorage.removeItem(LOCAL_CART_KEY);
      toast.success("✅ Sale processed successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "❌ Failed to process sale");
    }
  };

  const updateItemQuantity = (ProductID, newQty) => {
    if (newQty > 0) {
      dispatch(updateQuantity({ ProductID, ProductQuantity: newQty }));
    }
  };

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.ProductQuantity,
    0
  );
  const totalPrice = cart
    .reduce((sum, item) => {
      const tax = (item.ProductPrice * (item.ProductTax || 0)) / 100;
      const priceWithTax = item.ProductPrice + tax;
      return sum + priceWithTax * item.ProductQuantity;
    }, 0)
    .toFixed(2);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.replace("/auth/login");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-tr from-gray-50 to-blue-50 min-h-screen font-sans">
        <header className="w-full px-4 py-3 bg-[#0F172A] text-white shadow flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            Kaliget POS
          </h1>
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all"
          >
            Logout
          </button>
        </header>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
            Point of Sale (POS)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Barcode
              </label>
              <div className="relative">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddToCart()}
                  placeholder="Scan or enter barcode"
                  className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setScannerActive(true)}
                  className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                >
                  <CameraIcon size={22} />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 font-semibold transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleCheckPrice}
                className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 font-semibold transition"
              >
                Check Price
              </button>
            </div>
          </div>

          {scannerActive && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                <p className="text-center text-lg font-semibold mb-3">
                  Scan Barcode
                </p>
                <div id="reader" className="w-64 h-64 my-2 mx-auto"></div>
                <button
                  onClick={() => setScannerActive(false)}
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Cart Table */}
          <div className="overflow-x-auto border rounded-lg bg-gray-50 p-4 mt-4">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-blue-100 text-gray-700">
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Barcode</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Tax %</th>
                  <th className="p-2 text-left">Base Price</th>
                  <th className="p-2 text-left">Price w/ Tax</th>
                  <th className="p-2 text-left">Qty</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4 text-gray-500">
                      Cart is empty
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => {
                    const tax =
                      (item.ProductPrice * (item.ProductTax || 0)) / 100;
                    const totalWithTax =
                      (item.ProductPrice + tax) * item.ProductQuantity;

                    return (
                      <tr
                        key={item.ProductID}
                        className="border-t bg-white hover:bg-gray-100"
                      >
                        <td className="p-2">
                          <img
                            src={item.ProductImage}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </td>
                        <td className="p-2">{item.ProductBarcode}</td>
                        <td className="p-2">{item.ProductName}</td>
                        <td className="p-2">{item.ProductTax}</td>
                        <td className="p-2">{item.ProductPrice.toFixed(2)}</td>
                        <td className="p-2">
                          {(item.ProductPrice + tax).toFixed(2)}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.ProductID,
                                  item.ProductQuantity - 1
                                )
                              }
                              className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2">{item.ProductQuantity}</span>
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.ProductID,
                                  item.ProductQuantity + 1
                                )
                              }
                              className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-2 font-semibold">
                          {totalWithTax.toFixed(2)}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() =>
                              dispatch(removeFromCart(item.ProductID))
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between mt-6 text-lg font-semibold gap-2 text-blue-800">
            <p>Total Quantity: {totalQuantity}</p>
            <p>Total Price (Including Tax): {totalPrice} Birr</p>
          </div>

          <button
            onClick={handleProcessSale}
            disabled={isProcessing}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Process Sale"}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default POS;
