// set Trusted Remote for NFT contract on ETH
task(
    "nftSetTrustedRemote",
    "setTrustedRemote(chainId, sourceAddr) to allow the local contract to send/receive messages from known source contracts",
    require("./nftSetTrustedRemote")
).addParam("targetNetwork", "the target network to let this instance receive messages from")

// mint NFT on ETH
task("nftMint", "mint ExampleNFT", require("./nftMint"))

// set Trusted Remote for Avax contract
task(
    "avaxSetTrustedRemote",
    "setTrustedRemote(chainId, sourceAddr) to allow the local contract to receive messages from known source contracts",
    require("./avaxSetTrustedRemote")
).addParam("targetNetwork", "the target network to let this instance receive messages from")

// update the owner of NFT on ETH from Avax conttact
task("updateOwnerOfNFT", "update owner of NFT on ETH from AVAX contract", require("./updateOwnerOfNFT"))
    .addParam("targetNetwork", "the chainId")
    .addParam("tokenId", "the tokenId of NFT to update ownership")
