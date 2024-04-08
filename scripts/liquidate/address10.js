//liquidation for address: 0x122e2cD153a58BA06c79EF0384D6A696a93D0ab6

const { ethers } = require("hardhat");
const USDC_ABI = require("../../src/USDC_ABI.json");
const AAVE_POOL_ABI = require("../../src/aavePoolABI.json");

const BORROWER = "0x122e2cD153a58BA06c79EF0384D6A696a93D0ab6";
const WHALE = "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549";
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
        1. impersonate USDC address
        2. increase WHALE eth balance
        3. transfer USDC to WHALE from the USDC owner
        4. impersonate WHALE
        5. approve pool contract
        6. liquidate borrower
    */
  //   const USDT_OWNER_signer = await ethers.getSigner(USDT_OWNER);
  //   const usdtc = new ethers.Contract(USDC, USDT_ABI, USDT_OWNER_signer);

  //   console.log(await usdtc.getOwner());
  //   console.log((await usdtc.balanceOf(USDT_OWNER)) / 1e6);

  //   const txn = await usdtc.transfer(WHALE, await usdtc.balanceOf(USDT_OWNER));
  //   await txn.wait();
  //   console.log(await usdtc.balanceOf(WHALE));

  //   await hre.network.provider.request({
  //     method: "hardhat_stopImpersonatingAccount",
  //     params: [USDT_OWNER],
  //   });

  const WHALE_signer = await ethers.getSigner(WHALE);
  await network.provider.send("hardhat_setBalance", [
    WHALE,
    "0xDB20A668AD9520",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WHALE],
  });

  const usdccontract = new ethers.Contract(USDC, USDC_ABI, WHALE_signer);

  const contract = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, WHALE_signer);

  //   console.log("boorower health", await contract.getUserAccountData(BORROWER));

  console.log(
    "WHALE USDC balance before:",
    await usdccontract.balanceOf(WHALE)
  );

  console.log(
    "WHALE USDC allowance before:",
    await usdccontract.allowance(WHALE, AAVE_POOL)
  );

  const txn2 = await usdccontract.approve(
    AAVE_POOL,
    usdccontract.balanceOf(WHALE),
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
    ethers.constants.MaxUint256,
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
  console.log("WHALE USDC balance after:", await usdccontract.balanceOf(WHALE));
  console.log(
    "WHALE USDC allowance after:",
    await usdccontract.allowance(WHALE, AAVE_POOL)
  );
}

main();

/*
    liquidateCall{
        collat address: WBTC
        debt address: USDC
        user: borrower
        debttocober: max
        receiveaToken:false
    }
*/
