import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//
import Layout from "./pages/Layout";

import Sign from "./pages/Sign";
//redux
import NftProvider from "./context/nft/provider";
import LoadingProvider from "./context/loading/provider";
import { ToastContainer } from "react-toastify";
import NFTSelection from "./pages/NftSelection";
import ConfirmMutation from "./pages/ConfirmMutation";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <NftProvider>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Layout />}>
              <Route exact index element={<Sign />} />
              <Route exact path="signup" element={<Sign />} />
              {/* <Route exact path="scoreboard" element={<Scoreboard />} />
              <Route
                exact
                index
                path="selectcharacter"
                element={<CharacterSelection />}
              />
              <Route exact path="withdraw" element={<Withdraw />} /> */}
              <Route
                exact
                index
                path="selectnft"
                element={<NFTSelection />}
              />
              <Route
                exact
                index
                path="confirmmutation"
                element={<ConfirmMutation />}
              />
            </Route>
            {/* <Route exact path="game" element={<Main />} /> */}
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </LoadingProvider>
    </NftProvider>
  );
}

export default App;
