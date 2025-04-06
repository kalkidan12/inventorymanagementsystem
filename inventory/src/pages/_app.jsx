import React from "react";
import { Provider } from "react-redux";
import "../styles/globals.css";
import Layout from "../layout";
import { store } from "@/store/store";

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default App;
