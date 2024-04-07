import { TOKEN, depositWallet, solanaRPC } from "../env/development";
import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

var web3 = require("@solana/web3.js");

const net = "devnet";
export const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
};

export const connectWallet = async () => {
  const provider = getProvider();
  if (provider) {
    try {
      const response = await provider.connect();
      let wallet = response.publicKey.toString();
      return Promise.resolve(wallet);
    } catch (err) {
      return Promise.reject("Error While Connecting Phantom Wallet");
    }
  } else {
    return Promise.reject("You need to install Phantom Wallet!");
  }
};

export const disconnectWallet = async () => {
  const provider = getProvider();
  if (provider) {
      await provider.disconnect();
  }
};

export const deposit = async (amount) => {
  try {
    await connectWallet();
    const provider = await getProvider();
    var connection = new web3.Connection(web3.clusterApiUrl(net));
    var toPubkey = new web3.PublicKey(depositWallet);

    console.log(toPubkey, provider.publicKey);
    var transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: toPubkey,
        lamports: (web3.LAMPORTS_PER_SOL / 10) * amount,
      })
    );
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    transaction.feePayer = provider.publicKey;
    const { signature } = await provider.signAndSendTransaction(transaction);
    console.log(signature);
    return Promise.resolve(signature);
  } catch (err) {
    console.log(err);
    return Promise.reject("Deposit Failed");
  }
};

export const getTokenBalance = async () => {
  const provider = await getProvider();
  const connection = new web3.Connection(solanaRPC);
  const publicKey = new web3.PublicKey(provider.publicKey);
  const tokenMint = new web3.PublicKey(TOKEN);

  try {
      const ata = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          tokenMint,
          publicKey
      );
      const tokenAccountInfo = await connection.getParsedAccountInfo(ata);
      const tokenBalance =
          tokenAccountInfo.value.data.parsed.info.tokenAmount.uiAmount;

      return tokenBalance;
  } catch (err) {
      return 0;
  }
};

export const getBalance = async () => {
  const provider = await getProvider();
  const connection = new web3.Connection(solanaRPC);
  const publicKey = new web3.PublicKey(provider.publicKey);

  try {
      const accountInfo = await connection.getAccountInfo(publicKey);
      const balance = accountInfo.lamports;

      return balance;
  } catch (err) {
      return 0;
  }
};

export const transfer = async (amount) => {
  try {
      await connectWallet();
      const provider = await getProvider();
      var connection = new web3.Connection(solanaRPC);

      var toPubkey = new web3.PublicKey(depositWallet);
      var myMint = new web3.PublicKey(TOKEN);

      const fromTokenAddress = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          myMint,
          provider.publicKey
      );
      const toTokenAddress = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          myMint,
          toPubkey
      );

      var transaction = new web3.Transaction().add(
          Token.createTransferInstruction(
              TOKEN_PROGRAM_ID,
              fromTokenAddress,
              toTokenAddress,
              provider.publicKey,
              [],
              amount * 1 * 10 ** 6
          )
      );
      let blockhashObj = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhashObj.blockhash;

      transaction.feePayer = provider.publicKey;
      const { signature } = await provider.signAndSendTransaction(
          transaction
      );
      return Promise.resolve(signature);
  } catch (err) {
      console.log(err);
      return Promise.reject("Deposit Failed");
  }
};