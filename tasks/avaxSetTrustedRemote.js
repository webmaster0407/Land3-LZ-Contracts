const CHAIN_ID = require("../constants/chainIds.json")
const { getDeploymentAddresses } = require("../utils/readStatic")

module.exports = async function (taskArgs, hre) {
    const dstChainId = CHAIN_ID[taskArgs.targetNetwork]
    const dstAddr = getDeploymentAddresses(taskArgs.targetNetwork)["ExampleNFT"]
    const remoteUpdater = await ethers.getContract("RemoteUpdater")
    console.log(`[source] remoteUpdater.address: ${remoteUpdater.address}`)

    // avaxSetTrustedRemote() on the local contract, so it can receive message from the source contract
    try {
        let tx = await (await remoteUpdater.setTrustedRemote(dstChainId, dstAddr)).wait()
        console.log(`✅ [${hre.network.name}] setTrustedRemote(${dstChainId}, ${dstAddr})`)
        console.log(` tx: ${tx.transactionHash}`)
    } catch (e) {
        if (e.error?.message.includes("The trusted source address has already been set for the chainId")) {
            console.log("*trusted source already set*")
        } else {
            console.log(e)
        }
    }
}
