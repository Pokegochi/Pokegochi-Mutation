import { useRef, useEffect, useContext } from "react";
import { NftContext } from "../context/nft/context";
import { Outlet, Link, useNavigate } from "react-router-dom";

import pokegochiLogo from "../assets/logo/PokegochiLogo.png";
import { disconnectWallet } from "../utils/wallet";
import { toastNotify } from "../utils/toast";
export default function Layout () {
  const aud = useRef()
  const [nftState, setNftState] = useContext(NftContext)
  const navigate = useNavigate()

  useEffect(() => {
    aud.current.setAttribute("autoplay", "")
  }, [])

  useEffect(() => {
    console.log(nftState)
  }, [nftState])

  const disconnect = async () => {
    await disconnectWallet();
    setNftState({
        walletAddress: "",
        nftData: [],
        balance: 0,
        tokenBalance: 0,
        selectedNft: -1
    });
    toastNotify("success", "Successfully disconnected")
    navigate("/")
  }

  return (
    <>
      <div className="relative h-[100vh]">
        <nav className="border-gray-200 px-2 sm:px-4 rounded bg-[#346c54e5]">
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <Link to="/" className="flex flex-row gap-3 items-center">
              <img
                src={pokegochiLogo}
                className="h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-color1">
                Pokegochi
              </span>
            </Link>
            <div
              className=" hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="flex flex-col items-center p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                {
                  nftState.balance !== 0 && <li>
                    <p className="text-xs block py-2 pr-4 pl-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                      {`${(nftState.balance / Math.pow(10, 9)).toFixed(4)} sol`}
                    </p>
                  </li>
                }

                {
                  nftState.tokenBalance !== 0 && <li>
                    <p className="text-xs block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0">
                      {`${nftState.tokenBalance} XP`}
                    </p>
                  </li>
                }

                <li>
                  <Link
                    to="/"
                    className="block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  {nftState.walletAddress ? 
                    <button
                      className="block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0"
                      onClick={disconnect}
                    >
                      Disconnect
                    </button>
                  :
                    <Link
                      to="/signup"
                      className="block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0"
                    >
                      Connect
                    </Link>}
                </li>
              </ul>
            </div>
          </div>
          <audio ref={aud} autoPlay={true} src={require('./game/assets/audio/IntroMusic.mpeg').default}></audio>
        </nav>
        <div className="m-background"><Outlet /></div>
      </div>
    </>
  );
};