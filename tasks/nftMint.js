module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners()
    const owner = signers[0]
    const exampleNFT = await ethers.getContract("ExampleNFT")
    console.log(`[source] exampleNFT.address: ${exampleNFT.address}`)

    try {
        let tx = await (await exampleNFT.mint(owner.address, 1)).wait()
        console.log(`✅ [${hre.network.name}] mint`)
        console.log(` tx: ${tx.transactionHash}`)
        let nftTokenId = await ethers.provider.getTransactionReceipt(tx.transactionHash)
        console.log(` NFT nftId: ${parseInt(Number(nftTokenId.logs[0].topics[3]))}`)
    } catch (e) {
        console.log(e)
    }
}
