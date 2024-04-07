import { connectWallet, disconnectWallet, getBalance, getTokenBalance } from "../utils/wallet";
import { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NftContext } from "../context/nft/context";
import { LoadingContext } from "../context/loading/context";
import api from "../utils/api";
import pokegochiLogo from "../assets/logo/PokegochiLogo.png";
import { toastNotify } from "../utils/toast";

export default function Sign () {
  const [walletAddress, setWalletAddress] = useState("");
  const [nftState, setNftState] = useContext(NftContext);
  const [, setLoadingState] = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (nftState.walletAddress && !walletAddress) {
      setWalletAddress(nftState.walletAddress)
    }
  }, [nftState])

  const collectNft = useCallback(async () => {
    try {
      setLoadingState({ loading: true });
      const res = await api.post("/users/retrieve", {walletAddress: walletAddress})
      if ([200, 201, 204].includes(res.status)) {
        const nft = res.data.nft;
        if (nft) {
          const tokenBalance = await getTokenBalance();
          const balance = await getBalance();
          setNftState({
            ...nftState, 
            walletAddress: walletAddress, 
            nftData: nft,
            balance: balance,
            tokenBalance: tokenBalance,
          });
          toastNotify("success", "Successfully connected")
          navigate("/selectnft")
        }
      } else {
        toastNotify("error", "Connecting failed")
      }
    } catch(err) {
      toastNotify("warning", "Connecting ...")
    }
    setLoadingState({ loading: false });
  }, [walletAddress, navigate, setLoadingState, nftState, setNftState])

  const disconnect = async () => {
    await disconnectWallet();
    setNftState({
        walletAddress: "",
        nftData: [],
        balance: 0,
        tokenBalance: 0,
        selectedNft: -1
    });
  };

  const walletConnect = async () => {
    try {
      if (walletAddress) {
          disconnect();
      } else {
          const address = await connectWallet();
          setWalletAddress(address);
          setNftState({
            ...nftState, 
            walletAddress: address
          });
          toastNotify("success", "Wallet connected")
      }
    } catch (err) {
      toastNotify("error", "Wallet not connected")
    }
  }

  return (
    <>
      <div className="w-full m-section flex items-center sm:justify-evenly">
        <div className="container px-5 py-5 rounded-lg bg-[#91bc74] sm:px-10 sm:w-[500px] w-[300px] m-auto">
          <div className="flex justify-evenly items-center">

            <div className="text-gray-300 text-xl h-[300px] ">
              <img
                src={pokegochiLogo}
                alt="Pokegochi Logo"
                className="h-full m-auto"
              ></img>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-white"
              >
                WALLET ADDRESS {
                  walletAddress &&
                  " - " + walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 3)
                }
              </label>
              <button
                type="button"
                className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={walletConnect}
              >
                {walletAddress ? "Disconnect" : "Connect"}
              </button>
              <button
                type="button"
                className="w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={collectNft}
              >
                Continue?
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};