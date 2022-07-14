const CHAIN_ID = require("../constants/chainIds.json")
const { getDeploymentAddresses } = require("../utils/readStatic")

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners()
    const owner = signers[0]
    const account1 = signers[1]

    const dstChainId = CHAIN_ID[taskArgs.targetNetwork]
    const dstAddr = getDeploymentAddresses(taskArgs.targetNetwork)["ExampleNFT"]
    const remoteUpdater = await ethers.getContract("RemoteUpdater")
    console.log(`[source] remoteUpdater.address: ${remoteUpdater.address}`)

    // tokenId to update owner
    const tokenId = taskArgs.tokenId

    let tx = await (
        await remoteUpdater.updateOwnerOfNFT(
            dstChainId,
            tokenId,
            account1.address,
            { value: ethers.utils.parseEther("1") } // estimate/guess    
        )
    ).wait()
    console.log(`✅ Updated owner! From [${owner.address}] to [${account1.address}] on [${dstChainId}] from [${hre.network.name}]`)
    console.log(`...tx: ${tx.transactionHash}`)
}
