//LIQUIDATION FOR ADDRESS: 0xe43e9101c63af97c55fccc790641a8274a491303
const { ethers } = require("hardhat");
const USDT_ABI = require("../../src/USDT_ABI.json");
const AAVE_POOL_ABI = require("../../src/aavePoolABI.json");
const GHO_TOKEN_ABI = require("../../src/GHOToken.json");

const BORROWER = "0xe43e9101c63af97c55fccc790641a8274a491303";
const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const USDT_OWNER = "0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828";
const GHO_TOKEN = "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f";
const GHO_FACILITATOR = "0x00907f9921424583e7ffBfEdf84F92B7B2Be4977";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [GHO_FACILITATOR],
  });
  await network.provider.send("hardhat_setBalance", [
    GHO_FACILITATOR,
    "0xDB20A668AD9520",
  ]);
  /*
        1. impersonate usdt address
        2. increase vitalik eth balance
        3. transfer usdt to vitalik from the usdt owner
        4. impersonate vitalik
        5. approve pool contract
        6. liquidate borrower
    */
  const GHO_FACILITATOR_signer = await ethers.getSigner(GHO_FACILITATOR);
  const gho = new ethers.Contract(
    GHO_TOKEN,
    GHO_TOKEN_ABI,
    GHO_FACILITATOR_signer
  );

  //   console.log(await gho.getOwner());
  console.log(await gho.balanceOf(GHO_FACILITATOR));

  const mintTxn = await gho.mint(VITALIK, await gho.balanceOf(GHO_FACILITATOR));
  await mintTxn.wait();
  const mintTxn1 = await gho.mint(
    VITALIK,
    await gho.balanceOf(GHO_FACILITATOR)
  );
  await mintTxn1.wait();
  const mintTxn2 = await gho.mint(
    VITALIK,
    await gho.balanceOf(GHO_FACILITATOR)
  );
  await mintTxn2.wait();

  const txn = await gho.transfer(VITALIK, await gho.balanceOf(GHO_FACILITATOR));
  await txn.wait();
  console.log(await gho.balanceOf(VITALIK));

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [GHO_FACILITATOR],
  });

  const VITALIK_signer = await ethers.getSigner(VITALIK);
  await network.provider.send("hardhat_setBalance", [
    VITALIK,
    "0xDB20A668AD9520",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [VITALIK],
  });

  const ghocontract = new ethers.Contract(
    GHO_TOKEN,
    GHO_TOKEN_ABI,
    VITALIK_signer
  );

  const contract = new ethers.Contract(
    AAVE_POOL,
    AAVE_POOL_ABI,
    VITALIK_signer
  );

  //   console.log("boorower health", await contract.getUserAccountData(BORROWER));

  console.log(
    "Vitalik gho balance before:",
    await ghocontract.balanceOf(VITALIK)
  );
  console.log(
    "Vitalik gho allowance before:",
    await ghocontract.allowance(VITALIK, AAVE_POOL)
  );

  const txn2 = await ghocontract.approve(
    AAVE_POOL,
    ghocontract.balanceOf(VITALIK),
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
    GHO_TOKEN,
    BORROWER,
    ghocontract.balanceOf(VITALIK),
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
  console.log(
    "Vitalik gho balance after:",
    await ghocontract.balanceOf(VITALIK)
  );
  console.log(
    "Vitalik gho allowance after:",
    await ghocontract.allowance(VITALIK, AAVE_POOL)
  );
}

main();
