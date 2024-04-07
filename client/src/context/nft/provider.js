import { useState } from "react";
import { NftContext } from "./context";

const NftProvider = ({ children }) => {
    const [nftState, setNftState] = useState({
        walletAddress: "",
        balance: 0,
        tokenBalance: 0,
        nftData: [],
        selectedNft: -1
    });

    return (
        <NftContext.Provider value={[nftState, setNftState]}>
            {children}
        </NftContext.Provider>
    );
};

export default NftProvider;
