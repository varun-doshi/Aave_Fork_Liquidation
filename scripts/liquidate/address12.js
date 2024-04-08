//LIQUIDATE FOR ADDRESS:0x2D1A5c2269237cf98F7D5dAfe1Bef2f9Fed4f1D9
//borrowed DAI
const { ethers } = require("hardhat");
const DAI_TOKEN_ABI = require("../../src/DAIToken.json");
const AAVE_POOL_ABI = require("../../src/aavePoolABI.json");
const DAI_TOKEN = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const BORROWER = "0x2D1A5c2269237cf98F7D5dAfe1Bef2f9Fed4f1D9";
const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );
  const VITALIK_signer = await ethers.getSigner(VITALIK);
  const DAI_signer = await ethers.getSigner(DAI_TOKEN);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [DAI_TOKEN],
  });
  await network.provider.send("hardhat_setBalance", [
    DAI_TOKEN,
    "0xDB20A668AD9520",
  ]);

  const daiContract = new ethers.Contract(DAI_TOKEN, DAI_TOKEN_ABI, DAI_signer);
  const dai = new ethers.Contract(DAI_TOKEN, DAI_TOKEN_ABI, VITALIK_signer);

  console.log((await dai.balanceOf(VITALIK)) / 1e18);
  const txnapprove = await daiContract.approve(
    DAI_TOKEN,
    daiContract.balanceOf(DAI_TOKEN),
    {
      gasLimit: 180000,
    }
  );
  await txnapprove.wait();
  console.log("Dai contract approved");

  const txn2 = await daiContract.transfer(
    VITALIK,
    await daiContract.balanceOf(DAI_TOKEN),
    {
      gasLimit: 180000,
    }
  );
  await txn2.wait();
  console.log(await daiContract.balanceOf(VITALIK));

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [DAI_TOKEN],
  });

  await network.provider.send("hardhat_setBalance", [
    VITALIK,
    "0xDB20A668AD9520",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [VITALIK],
  });

  const contract = new ethers.Contract(
    AAVE_POOL,
    AAVE_POOL_ABI,
    VITALIK_signer
  );

  console.log("Vitalik DAI balance before:", await dai.balanceOf(VITALIK));
  console.log(
    "Vitalik DAI allowance before:",
    await dai.allowance(VITALIK, AAVE_POOL)
  );

  const txn = await dai.approve(AAVE_POOL, dai.balanceOf(VITALIK), {
    gasLimit: 180000,
  });
  await txn.wait();
  console.log(
    "boorower health before",
    await contract.getUserAccountData(BORROWER)
  );

  const txn1 = await contract.liquidationCall(
    WBTC,
    DAI_TOKEN,
    BORROWER,
    ethers.constants.MaxUint256,
    false,
    {
      gasLimit: 2500000,
    }
  );
  await txn1.wait();

  console.log(
    "boorower health after",
    await contract.getUserAccountData(BORROWER)
  );
  console.log("Vitalik DAI balance after:", await dai.balanceOf(VITALIK));
  console.log(
    "Vitalik DAI allowance after:",
    await dai.allowance(VITALIK, AAVE_POOL)
  );
}

main();

/*
    liquidateCall{
        collat address: WBTC
        debt address: USDT
        user: borrower
        debttocober: max
        receiveaToken:false
    }
*/
