const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

const secret = require('../../config/guideSecret.json')
const attributesGroup = require('../../config/attributes.json')
const upgradeGroup = require('../../config/upgrade.json')

const { Connection, Keypair, PublicKey, clusterApiUrl } = require("@solana/web3.js")
const { ShyftSdk, Network } = require("@shyft-to/js")
const { Metaplex, keypairIdentity, irysStorage } = require("@metaplex-foundation/js")


const SHYFT_API = config.get("SHYFT_API")
const shyft = new ShyftSdk({ apiKey: SHYFT_API, network: Network.Mainnet });

const QUICKNODE_RPC = config.get("QUICKNODE_RPC");
const QUICKNODE_RPC2 = config.get("QUICKNODE_RPC2");
const SOLANA_CONNECTION_QUICKNODE = new Connection(clusterApiUrl("mainnet-beta"));
const SOLANA_CONNECTION_QUICKNODE1 = new Connection(QUICKNODE_RPC);
const SOLANA_CONNECTION_QUICKNODE2 = new Connection(QUICKNODE_RPC2);

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
console.log(WALLET.publicKey.toString())
const METAPLEX_QUICKNODE = Metaplex.make(SOLANA_CONNECTION_QUICKNODE)
    .use(keypairIdentity(WALLET))
    .use(irysStorage());

const METAPLEX_QUICKNODE1 = Metaplex.make(SOLANA_CONNECTION_QUICKNODE1)
    .use(keypairIdentity(WALLET))
    .use(irysStorage());

const METAPLEX_QUICKNODE2 = Metaplex.make(SOLANA_CONNECTION_QUICKNODE2)
    .use(keypairIdentity(WALLET))
    .use(irysStorage());

const collectAddress = config.get("collectAddress")
const secretKey = config.get("secretKey")

const imgType = config.get("imgType")
const imgHeader = config.get("imgHeader")

const uploadMetadata = async (imgUri, imgType, nftName, description, attributes, symbol, seller_fee_basis_points, external_url, collection, category, creators) => {
  console.log(`Step 2 - Uploading New MetaData`);
  const { uri } = await METAPLEX_QUICKNODE
      .nfts()
      .uploadMetadata({
        name: nftName,
        description: description,
        image: imgUri,
        attributes: attributes,
        symbol: symbol, 
        // seller_fee_basis_points: seller_fee_basis_points, 
        // external_url: external_url, 
        collection: collection, 
        properties: {
          // creators: creators, 
          files: [
              {
                  type: imgType,
                  uri: imgUri,
              },
          ], 
          // category: category, 
        }, 
      });
  console.log('Metadata URI:', uri);
  return uri;
}

const updateNft = async (nft, metadataUri, newName) => {
  console.log(`Step 3 - Updating NFT`);
  try {
    console.log("try1")
    await METAPLEX_QUICKNODE
      .nfts()
      .update({
        nftOrSft: nft,
        name: newName,
        uri: metadataUri
      });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}`);
    return nft.address;
  } catch(err) {
    console.log("Error1:", err)
  }
  try {
    console.log("try2")
    await METAPLEX_QUICKNODE1
      .nfts()
      .update({
        nftOrSft: nft,
        name: newName,
        uri: metadataUri
      });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}`);
    return nft.address;
  } catch(err) {
    console.log("Error2:", err)
  }
  try {
    console.log("try3")
    await METAPLEX_QUICKNODE2
      .nfts()
      .update({
        nftOrSft: nft,
        name: newName,
        uri: metadataUri
      });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}`);
    return nft.address;
  } catch(err) {
    console.log("Error3:", err)
  }
  try {
    console.log("try4")
    await METAPLEX_QUICKNODE
      .nfts()
      .update({
        nftOrSft: nft,
        name: newName,
        uri: metadataUri
      });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}`);
    return nft.address;
  } catch(err) {
    console.log("Error4:", err)
  }
  try {
    console.log("try5")
    await METAPLEX_QUICKNODE1
      .nfts()
      .update({
        nftOrSft: nft,
        name: newName,
        uri: metadataUri
      });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}`);
    return nft.address;
  } catch(err) {
    console.log("Error5:", err)
  }
  try {
    console.log("try6")
    await METAPLEX_QUICKNODE2
      .nfts()
      .update({
        nftOrSft: nft,
        name: newName,
        uri: metadataUri
      });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}`);
    return nft.address;
  } catch(err) {
    console.log("Error6:", err)
  }
  console.log("totally Error")
  return ""
}

const uploadImage = async (filePath, fileName) => {
  console.log(`Step 0 - Uploading Image`);
  const imgBuffer = fs.readFileSync(`${filePath + fileName}`);
  const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
  const imgUri = await METAPLEX_QUICKNODE.storage().upload(imgMetaplexFile);
  console.log(`   Image URI:`,imgUri);
  return imgUri;
}

router.post("/retrieve", async (req, res) => {
  console.log("retrieve")
  try {
    const {walletAddress} = req.body
    if (!walletAddress) {
      return res.status(406).send("No Wallet");
    }
    const nft = await shyft.nft.getNftByOwner({owner: walletAddress})
    const filteredNft = nft.filter(el => el.collection?.address?.toString() === collectAddress)

    return res.json({nft: filteredNft})
  } catch(err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

router.post("/jwtheader", async (req, res) => {
  console.log("jwtheader")
  try {
    const { walletAddress, transactionId } = req.body
    const timeStamp = (new Date()).getTime()
    const payload = {
      date: timeStamp, 
      walletAddress: walletAddress,
      transactionId: transactionId
      // Add any other data you want to include in the token payload
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '5m' }); // Token expires in 5 minutes
    return res.json({token: token})
  } catch(err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

router.post("/converthatchling", async (req, res) => {
  console.log("converthatchling")
  const {walletAddress, transactionId, nftAddress} = req.body;
  try {
    const token = req.headers["jwt-header"]
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded)
    if (walletAddress === decoded.walletAddress && transactionId === decoded.transactionId) {
      console.log(`Updating Metadata of NFT: ${nftAddress}}`);

      // const imgUri = await uploadImage("uploads/","react logo.png");

      //Step 1 - Fetch existing NFT
      console.log(`Step 1 - Fetching existing NFT`);
      const nft = await METAPLEX_QUICKNODE.nfts().findByMint({ mintAddress: new PublicKey(nftAddress) });
      if (!nft || !nft.json?.image) {throw new Error("Unable to find existing nft or image uri!")}

      console.log(`NFT Found!`);
      const imgUrl = nft.json.image
      const nftName = nft.json.name
      const nftDescription = nft.json.description
      const attributes = nft.json.attributes
      const symbol = nft.json.symbol
      const seller_fee_basis_points = nft.json.seller_fee_basis_points
      const external_url = nft.json.external_url
      const collection = nft.json.collection
      const category = nft.json.properties.category
      const creators = nft.json.properties.creators

      let id = attributes?.find(attribute => attribute.trait_type === "ID.")?.value ?? "";
      let no = attributes?.find(attribute => attribute.trait_type === "Pokeledger No.")?.value ?? "";
      let species = attributes?.find(attribute => attribute.trait_type === "Pokegochi Species")?.value ?? "";
      let stage = attributes?.find(attribute => attribute.trait_type === "Stage")?.value ?? "";
      let rarity = attributes?.find(attribute => attribute.trait_type === "Rarity")?.value ?? "";
      let type = attributes?.find(attribute => attribute.trait_type === "Type")?.value ?? "";
      let personality = attributes?.find(attribute => attribute.trait_type === "Personality")?.value ?? "";

      const collectionOne = upgradeGroup.find((ele) => ele.type === species)
      console.log("collectionOne:", collectionOne)
      if (collectionOne && collectionOne.pairs) {
        const pair = collectionOne.pairs.find((ele) => ele.personality.includes(personality))
        console.log("pair:", pair)
        if (pair) {
          const babies = pair.baby
          if (babies.length > 0) {
            const baby = babies[0].species
            const newAttribute = attributesGroup.find((ele) => ele.species === baby)
            console.log("babies:", baby)

            if (newAttribute) {
              id = newAttribute.id
              species = newAttribute.species
              stage = newAttribute.stage
              rarity = newAttribute.common
              type = newAttribute.type
              no = newAttribute.ledgerNo
              let newName = `${species} - ${id}`

              const newUri = await uploadMetadata(`${imgHeader}/${no}`, imgType, newName || "", nftDescription || "", [
                {trait_type: 'ID.', value: id},
                {trait_type: 'Pokeledger No.', value: no},
                {trait_type: 'Pokegochi Species', value: species},
                {trait_type: 'Stage', value: stage},
                {trait_type: 'Rarity', value: rarity},
                {trait_type: 'Type', value: type},
                {trait_type: 'Personality', value: personality},
              ], symbol, seller_fee_basis_points, external_url, collection, category, creators)

              console.log(newUri)
              console.log("Update NFT")
              //Step 3 - Update NFT
              const newNftAddress = await updateNft(nft, newUri, newName || "")
              if (newNftAddress !== "") {
                const updatedNft = await METAPLEX_QUICKNODE.nfts().refresh(nft)
                return res.json({updatedNft: updatedNft, newUri: newUri})
              } else {
                return res.status(404).send("Server Error")
              }
            }
          }
        }
      }
      return res.status(404).send("Server Error")
    } else {
      return res.status(406).send("Invalid credential")
    }
  } catch(err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

router.post("/convertbaby", async (req, res) => {
  console.log("convertbaby")
  const {walletAddress, transactionId, nftAddress} = req.body;
  try {
    const token = req.headers["jwt-header"]
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded)
    if (walletAddress === decoded.walletAddress && transactionId === decoded.transactionId) {
      console.log(`Updating Metadata of NFT: ${nftAddress}}`);

      // const imgUri = await uploadImage("uploads/","react logo.png");

      //Step 1 - Fetch existing NFT
      console.log(`Step 1 - Fetching existing NFT`);
      const nft = await METAPLEX_QUICKNODE.nfts().findByMint({ mintAddress: new PublicKey(nftAddress) });
      if (!nft || !nft.json?.image) {throw new Error("Unable to find existing nft or image uri!")}

      console.log(`NFT Found!`);
      const imgUrl = nft.json.image
      const nftName = nft.json.name
      const nftDescription = nft.json.description
      const attributes = nft.json.attributes
      const symbol = nft.json.symbol
      const seller_fee_basis_points = nft.json.seller_fee_basis_points
      const external_url = nft.json.external_url
      const collection = nft.json.collection
      const category = nft.json.properties.category
      const creators = nft.json.properties.creators

      let id = attributes?.find(attribute => attribute.trait_type === "ID.")?.value ?? "";
      let no = attributes?.find(attribute => attribute.trait_type === "Pokeledger No.")?.value ?? "";
      let species = attributes?.find(attribute => attribute.trait_type === "Pokegochi Species")?.value ?? "";
      let stage = attributes?.find(attribute => attribute.trait_type === "Stage")?.value ?? "";
      let rarity = attributes?.find(attribute => attribute.trait_type === "Rarity")?.value ?? "";
      let type = attributes?.find(attribute => attribute.trait_type === "Type")?.value ?? "";
      let personality = attributes?.find(attribute => attribute.trait_type === "Personality")?.value ?? "";

      // const collectionOne = upgradeGroup.find((ele) => ele.type === species)
      for (let collectionOne of upgradeGroup) {
        const pairs = collectionOne.pairs
        for (let pair of pairs) {
          const babies = pair.baby
          if (babies && babies.length > 0 && babies.find(baby => baby.species === species)) {
            const adults = pair.adult
            if (adults && adults.length > 0) {
              const adult = adults[0].species
              const newAttribute = attributesGroup.find((ele) => ele.species === adult)
              console.log("adults:", adult)

              if (newAttribute) {
                id = newAttribute.id
                species = newAttribute.species
                stage = newAttribute.stage
                rarity = newAttribute.common
                type = newAttribute.type
                no = newAttribute.ledgerNo
                let newName = `${species} - ${id}`

                const newUri = await uploadMetadata(`${imgHeader}/${no}`, imgType, newName || "", nftDescription || "", [
                  {trait_type: 'ID.', value: id},
                  {trait_type: 'Pokeledger No.', value: no},
                  {trait_type: 'Pokegochi Species', value: species},
                  {trait_type: 'Stage', value: stage},
                  {trait_type: 'Rarity', value: rarity},
                  {trait_type: 'Type', value: type},
                  {trait_type: 'Personality', value: personality},
                ], symbol, seller_fee_basis_points, external_url, collection, category, creators)

                console.log(newUri)
                console.log("Update NFT")
                //Step 3 - Update NFT
                const newNftAddress = await updateNft(nft, newUri, newName || "")
                if (newNftAddress !== "") {
                  const updatedNft = await METAPLEX_QUICKNODE.nfts().refresh(nft)
                  return res.json({updatedNft: updatedNft, newUri: newUri})
                } else {
                  return res.status(404).send("Server Error")
                }
              }
            }
          }
        }
      }
      
    } else {
      return res.status(406).send("Invalid credential")
    }
  } catch(err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

module.exports = router;
