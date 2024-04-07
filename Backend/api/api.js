var web3 = require("@solana/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const bs58 = require("bs58");
const User = require("../model/User");
function decrypt(text) {
  return Math.sqrt(text + 4) - 2;
}

const addEarn = async (userId, earn, sec) => {
  try {

    const user = await User.findById(userId);
    console.log(user.sec, decrypt(sec));
    if (decrypt(sec) != user.sec) throw new Error();
    user.earn = user.earn + earn;
    user.sec = user.sec + Math.random() * 10;
    if (user.earn > 100000) user.earn = 100000;
    await user.save();
    console.log(user.earn);
  } catch (err) {
    console.error(err.message);
  }
};

const addScore = async (userId, score) => {
  try {
    const user = await User.findById(userId);

    user.score = score;
    await user.save();
    console.log(user.earn);
  } catch (err) {
    console.error(err.message);
  }
}

const withDraw = async (walletAddress, tamount) => {
  console.log(walletAddress, tamount);
  let amount = tamount;
  var connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
  // Construct a `Keypair` from secret key
  var fromWallet = web3.Keypair.fromSecretKey(
    bs58.decode(process.env.DEPOSIT)
  );
  var toWallet = new web3.PublicKey(walletAddress);
  var myMint = new web3.PublicKey(process.env.TOKEN);

  var myToken = new Token(connection, myMint, TOKEN_PROGRAM_ID, fromWallet);

  var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  );
  var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(toWallet);

  var transaction = new web3.Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      amount * 10 ** 5
    )
  );

  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );
  console.log(signature);
  return signature;
};
module.exports = {
  addEarn,
  addScore,
  withDraw,
};
