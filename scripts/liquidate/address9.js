//liquidation for address: 0x890E0CA73Ec07Dd6b3219b998ab7F4e421870eAd

const { ethers } = require("hardhat");
const USDC_ABI = require("../../src/USDC_ABI.json");
const AAVE_POOL_ABI = require("../../src/aavePoolABI.json");

const BORROWER = "0x890E0CA73Ec07Dd6b3219b998ab7F4e421870eAd";
const VITALIK = "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  //   await hre.network.provider.request({
  //     method: "hardhat_impersonateAccount",
  //     params: [USDT_OWNER],
  //   });
  /*
        1. impersonate usdt address
        2. increase vitalik eth balance
        3. transfer usdt to vitalik from the usdt owner
        4. impersonate vitalik
        5. approve pool contract
        6. liquidate borrower
    */
  //   const USDT_OWNER_signer = await ethers.getSigner(USDT_OWNER);
  //   const usdtc = new ethers.Contract(USDT, USDT_ABI, USDT_OWNER_signer);

  //   console.log(await usdtc.getOwner());
  //   console.log((await usdtc.balanceOf(USDT_OWNER)) / 1e6);

  //   const txn = await usdtc.transfer(VITALIK, await usdtc.balanceOf(USDT_OWNER));
  //   await txn.wait();
  //   console.log(await usdtc.balanceOf(VITALIK));

  //   await hre.network.provider.request({
  //     method: "hardhat_stopImpersonatingAccount",
  //     params: [USDT_OWNER],
  //   });

  const VITALIK_signer = await ethers.getSigner(VITALIK);
  await network.provider.send("hardhat_setBalance", [
    VITALIK,
    "0xDB20A668AD9520",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [VITALIK],
  });

  const usdtcontract = new ethers.Contract(USDC, USDC_ABI, VITALIK_signer);

  const contract = new ethers.Contract(
    AAVE_POOL,
    AAVE_POOL_ABI,
    VITALIK_signer
  );

  //   console.log("boorower health", await contract.getUserAccountData(BORROWER));

  console.log(
    "Vitalik USDT balance before:",
    await usdtcontract.balanceOf(VITALIK)
  );
  console.log(
    "Vitalik USDT allowance before:",
    await usdtcontract.allowance(VITALIK, AAVE_POOL)
  );

  const txn2 = await usdtcontract.approve(
    AAVE_POOL,
    usdtcontract.balanceOf(VITALIK),
    {
      gasLimit: 180000,
    }
  );
  await txn2.wait();
  console.log(
    "boorower health before",
    await contract.getUserAccountData(BORROWER)
  );

  const txn1 = await contract.liquidationCall(
    WBTC,
    USDC,
    BORROWER,
    usdtcontract.balanceOf(VITALIK),
    false,
    {
      gasLimit: 3000000,
    }
  );
  await txn1.wait();

  console.log(
    "boorower health after",
    await contract.getUserAccountData(BORROWER)
  );
  console.log(
    "Vitalik USDT balance after:",
    await usdtcontract.balanceOf(VITALIK)
  );
  console.log(
    "Vitalik USDT allowance after:",
    await usdtcontract.allowance(VITALIK, AAVE_POOL)
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

//703069608633601681
//544545289507496465
