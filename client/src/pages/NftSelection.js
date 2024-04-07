import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NftContext } from "../context/nft/context";
import { isMobile } from "../utils/utils";
const NFTSelection = () => {
    const [nftState, setNftState] = useContext(NftContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (nftState.walletAddress === "") {
            navigate("/")
        }
    }, [])

    const selectNft = (index) => {
        setNftState({
            ...nftState, 
            selectedNft: index, 
        })
        navigate("/confirmmutation")
    }
        
    return (<>
        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 mx-auto pb-5">
            <div className="rounded-[50px] bg-[#91bc74] p-10">
                <div id="score-title" className="text-center text-[12px] md:text-[24px] text-white my-0 md:my-5">
                    {isMobile() ? "Select Pokegochi": "Select Pokegochi for mutation"}
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row w-[90%] md:w-[900px] rounded-lg bg-[#91bc74] p-2 md:py-10 md:px-5 mx-auto overflow-auto gap-5">
            {
              nftState.nftData && nftState.nftData.map((nft, index) => {
                return <div key={index} onClick={() => selectNft(index)} className="hover:scale-[110%] hover:cursor-pointer character w-[100%] md:w-[200px] shrink-0 flex flex-col gap-5 justify-center md:justify-start items-center md:items-start">
                    <img src={nft.image_uri} alt="NFT" width={200} height={200} />
                    <p className="text-white text-center text-xs">
                        {nft.name}
                    </p>
                </div>
              })
            }
        </div>
    </>);
}
export default NFTSelection