const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
    
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Deploying to network: ", hre.network.name);

    // Get contract balance

    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    )

    //Fomratting contract balance

    console.log(
        "Contract balance: ",
        hre.ethers.utils.formatEther(contractBalance)
    )

    // Send Wave

    let waveTxn = await waveContract.wave("Message")
    await waveTxn.wait();

    let waveTxn2 = await waveContract.wave("Message 2");
    await waveTxn2.wait();

    // Get updated contract balance

    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    )

    console.log(
        "Contract balance: ",
        hre.ethers.utils.formatEther(contractBalance)
    )

    let allWaves = await waveContract.getAllWaves();
    console.log("All Waves: ", allWaves);
}

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    }
    catch(e){
        console.error(e);
        process.exit(1);
    }
}

runMain();