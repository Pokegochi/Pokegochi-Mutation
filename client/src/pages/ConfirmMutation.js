import { useState, useEffect, useContext, useCallback } from "react"
import { NftContext } from "../context/nft/context"
import { getBalance, getTokenBalance, transfer } from "../utils/wallet"
import loadingForever from "../context/loading/Images/loading-forever.gif"
import api from "../utils/api"

import hatchlingConvert from "../assets/image/hatchling_to_baby.png"
import babyConvert from "../assets/image/baby_to_adult.png"
import ProfNFT from "../assets/gif/Prof.gif"
import { toastNotify } from "../utils/toast"
import { useNavigate } from "react-router-dom"
import { LoadingContext } from "../context/loading/context"

const ConfirmMutation = () => {
    const [nftState, setNftState] = useContext(NftContext);
    const [, setLoadingState] = useContext(LoadingContext);
    const [selectedNft, setNft] = useState({});
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (nftState.walletAddress === "") {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        if (nftState.selectedNft !== -1) {
            setNft(nftState.nftData[nftState.selectedNft])
        }
    }, [nftState])

    const collectNft = useCallback(async () => {
        try {
            const walletAddress = nftState.walletAddress
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
            }
          } else {
          }
        } catch(err) {
        }
        setLoadingState({ loading: false });
    }, [navigate, setLoadingState, nftState, setNftState])

    const convertHatchling = async () => {
        if (selectedNft.attributes.Stage !== "Hatchling")
            return;
        console.log("convertHatchling")   
        setShowModal(true)
        try {
            const signature = await transfer(1500)
            const requestData = {
                walletAddress: nftState.walletAddress, 
                transactionId: signature, 
                nftAddress: nftState.nftData[nftState.selectedNft].mint
            };
            let token = ""
            console.log("signature: ", signature)
            {
                const response = await api.post("/users/jwtheader", requestData)
                if ([200, 201, 204].includes(response.status)) {
                    token = response.data.token
                    console.log("token:", token)
                } else {
                    return
                }
            }
            if (token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json', 
                        'jwt-header': token
                    }
                }; 
                const response = await api.post("/users/converthatchling", requestData, config)
                if ([200, 201, 204].includes(response.status)) {
                    toastNotify("success", "Successfully mutated")
                    await collectNft()
                    navigate("/selectnft")
                } else {
                    return
                }
            }
        } catch(err) {
            console.log("ERROR:", err)
            toastNotify("error", "Mutation Failed")
        }
        setShowModal(false)
    }

    const convertBaby = async () => {
        if (selectedNft.attributes.Stage !== "Baby")
            return;
        console.log("convertBaby")
        setShowModal(true)
        try {
            const signature = await transfer(3000)
            const requestData = {
                walletAddress: nftState.walletAddress, 
                transactionId: signature, 
                nftAddress: nftState.nftData[nftState.selectedNft].mint
            };
            let token = ""
            console.log("signature: ", signature)
            {
                const response = await api.post("/users/jwtheader", requestData)
                if ([200, 201, 204].includes(response.status)) {
                    token = response.data.token
                    console.log("token:", token)
                } else {
                    return
                }
            }
            if (token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json', 
                        'jwt-header': token
                    }
                }; 
                const response = await api.post("/users/convertbaby", requestData, config)
                if ([200, 201, 204].includes(response.status)) {
                    toastNotify("success", "Successfully mutated")
                    // const updatedNft = response.data.updatedNft
                    // nftState.nftData.splice(nftState.selectedNft, 1, updatedNft)
                    await collectNft()
                    navigate("/selectnft")
                } else {
                    return
                }
            }
        } catch(err) {
            console.log("ERROR:", err)
            toastNotify("error", "Mutation Failed")
        }
        setShowModal(false)
    }

    if (!selectedNft || !selectedNft.attributes || !selectedNft.attributes.Stage) {
        return (<div className="w-full h-full bg-black/30 z-40 fixed left-0 top-0">
            <img
                src={loadingForever}
                className="absolute w-24 h-24 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                alt="Loading..."
            />
        </div>)
    }
        
    return (<>
        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 mx-auto pb-5">
            <div className="rounded-[50px] bg-[#91bc74] p-10">
                <div id="score-title" className="text-center text-[20px] md:text-[24px] sm:text-[50px] text-white my-5">
                    Confirm mutation type
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row w-[90%] md:w-[900px] rounded-lg bg-[#91bc74] p-2 md:py-10 md:px-5 mx-auto overflow-auto gap-5">
            <div className={`flex flex-col justify-center items-center gap-5`}>
                <img
                    src={hatchlingConvert}
                    className={`cursor-pointer rounded-md border-transparent border-solid hover:border-indigo-500/100 border-8 ${(!selectedNft || selectedNft.attributes.Stage !== "Hatchling") && "grayscale"}`}
                    alt="HatchlingConvert"
                    onClick={() => convertHatchling()}
                    disabled={!selectedNft || selectedNft.attributes.Stage !== "Hatchling"}
                />
                <button onClick={() => convertHatchling()} className={`focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:grayscale`} disabled={!selectedNft || selectedNft.attributes.Stage !== "Hatchling"}>1500 XP</button>
            </div>
            <div className={`flex flex-col justify-center items-center gap-5`}>
                <img
                    src={babyConvert}
                    className={`cursor-pointer rounded-md border-transparent border-solid hover:border-indigo-500/100 border-8 ${(!selectedNft || selectedNft.attributes.Stage !== "Baby") && "grayscale"}`}
                    alt="BabyConvert"
                    onClick={() => convertBaby()}
                    disabled={!selectedNft || selectedNft.attributes.Stage !== "Baby"}
                />
                <button onClick={() => convertBaby()} className={`focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:grayscale`} disabled={!selectedNft || selectedNft.attributes.Stage !== "Baby"}>3000 XP</button>
            </div>
        </div>

        {
            showModal && <div className="absolute w-full h-full flex justify-center items-center bg-black/30">
                <div className="p-5 rounded-xl bg-[#91bc74] flex flex-col justify-center items-center gap-5">
                    <img src={ProfNFT} alt="Professional NFT" className="w-[600px] h-[600px]" draggable={false} />
                    <p className="text-16 text-center text-white">Mutation in progress...</p>
                </div>
            </div>
        }
    </>);
}
export default ConfirmMutation