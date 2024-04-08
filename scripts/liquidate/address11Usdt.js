//second LIQUIDATION FOR ADDRESS: 0x61227bac9fd51ace4bbadb25b21e723129f1e3c7

const { ethers } = require("hardhat");
const USDT_ABI = require("../../src/USDT_ABI.json");
const AAVE_POOL_ABI = require("../../src/aavePoolABI.json");

const BORROWER = "0x61227bac9fd51ace4bbadb25b21e723129f1e3c7";
const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const USDT_OWNER = "0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDT_OWNER],
  });
  /*
        1. impersonate usdt address
        2. increase vitalik eth balance
        3. transfer usdt to vitalik from the usdt owner
        4. impersonate vitalik
        5. approve pool contract
        6. liquidate borrower
    */
  const USDT_OWNER_signer = await ethers.getSigner(USDT_OWNER);
  const usdtc = new ethers.Contract(USDT, USDT_ABI, USDT_OWNER_signer);

  console.log(await usdtc.getOwner());
  console.log((await usdtc.balanceOf(USDT_OWNER)) / 1e6);

  const txn = await usdtc.transfer(VITALIK, await usdtc.balanceOf(USDT_OWNER));
  await txn.wait();
  console.log(await usdtc.balanceOf(VITALIK));

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [USDT_OWNER],
  });

  const VITALIK_signer = await ethers.getSigner(VITALIK);
  await network.provider.send("hardhat_setBalance", [
    VITALIK,
    "0x44C19452A9B9A00",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [VITALIK],
  });

  const usdtcontract = new ethers.Contract(USDT, USDT_ABI, VITALIK_signer);

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
    USDT,
    BORROWER,
    ethers.constants.MaxUint256,
    false,
    {
      gasLimit: 30000000,
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
