const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Test: ", function () {
    const chainIdEth = 1
    const chainIdAvx = 2

    let owner, account1, lzEndpointEthMock, lzEndpointAvxMock, NFT, RemoteUpdater, LZEndpointMock, NFTContract

    before(async function () {
        const signers = await ethers.getSigners()
        owner = signers[0]
        account1 = signers[1]

        LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")
        NFTContract = await ethers.getContractFactory("ExampleNFT")
        RemoteUpdaterContract = await ethers.getContractFactory("RemoteUpdater")
    })

    beforeEach(async function () {
        lzEndpointEthMock = await LZEndpointMock.deploy(chainIdEth)
        lzEndpointAvxMock = await LZEndpointMock.deploy(chainIdAvx)

        // create two NFT and RemoteUpdater instances
        NFT = await NFTContract.deploy(lzEndpointEthMock.address)
        RemoteUpdater = await RemoteUpdaterContract.deploy(lzEndpointAvxMock.address)

        lzEndpointEthMock.setDestLzEndpoint(RemoteUpdater.address, lzEndpointAvxMock.address)
        lzEndpointAvxMock.setDestLzEndpoint(NFT.address, lzEndpointEthMock.address)

        // set each contracts source address so it can send to each other
        await NFT.setTrustedRemote(chainIdAvx, RemoteUpdater.address) // for A, set B
        await RemoteUpdater.setTrustedRemote(chainIdEth, NFT.address) // for B, set A
    })

    it("updateOwnerOfNFT() - mint on the Eth chain and update the owner of NFT from Avax chain", async function () {
        // mint NFT
        const tokenId = 1;
        await NFT.mint(owner.address, 1)

        // verify the current owner of the token
        expect(await NFT.ownerOf(tokenId)).to.be.equal(owner.address)

        // update owner of NFT
        // await NFT.approve(NFT.address, tokenId)
        await RemoteUpdater.updateOwnerOfNFT(chainIdEth, tokenId, account1.address)

        // verify the new owner of the token
        expect(await NFT.ownerOf(tokenId)).to.be.equal(account1.address)
    })

    it("update the owner of NFT from Avax chain when paused should revert", async function () {

        // disable remote update
        await RemoteUpdater.enable(false)

        // update owner of NFT
        const tokenId = 1;
        await expect(RemoteUpdater.updateOwnerOfNFT(chainIdEth, tokenId, account1.address)).to.revertedWith("Pausable: paused")
    })
})
