//CHANGE AAVE WBTC ORACLE ADDRESS TO DUMMY ADDRESS

const { ethers } = require("hardhat");
const AAVE_ORACLE_ABI = require("../src/aaveOracle.json");

const AAVE_ORACLE = "0x54586bE62E3c3580375aE3723C145253060Ca0C2";
const POOL_ADMIN = "0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A";
const MY_ORACLE = "0x55027d3dBBcEA0327eF73eFd74ba0Af42A13A966";
const WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

async function main() {
  /*
        1. impersonate the pool admin
        2. check balance:
            if eth balance is there, run setFallbackOracle
            if not then supply and then run the same
    */

  const POOL_ADMIN_signer = await ethers.getSigner(POOL_ADMIN);
  await network.provider.send("hardhat_setBalance", [
    POOL_ADMIN,
    "0x11771C366B1C20",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [POOL_ADMIN],
  });

  const AAVE_ORACLE_CONTRACT = new ethers.Contract(
    AAVE_ORACLE,
    AAVE_ORACLE_ABI,
    POOL_ADMIN_signer
  );

  //   const txn = await AAVE_ORACLE_CONTRACT.connect(
  //     POOL_ADMIN_signer
  //   ).setFallbackOracle("0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A", {
  //     gasLimit: 100000,
  //   });
  //   await txn.wait();
  //   console.log(await AAVE_ORACLE_CONTRACT.getAssetPrice(WBTC_ADDRESS));

  const assets = ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"];
  const sources = ["0x55027d3dBBcEA0327eF73eFd74ba0Af42A13A966"];
  console.log(
    "WBTC price BEFORE manipulation:",
    ethers.utils.formatUnits(
      await AAVE_ORACLE_CONTRACT.getAssetPrice(WBTC_ADDRESS),
      8
    )
  );

  const txn1 = await AAVE_ORACLE_CONTRACT.connect(
    POOL_ADMIN_signer
  ).setAssetSources(assets, sources, {
    gasLimit: 180000,
  });
  await txn1.wait();

  console.log(
    "WBTC price AFTER manipulation:",
    ethers.utils.formatUnits(
      await AAVE_ORACLE_CONTRACT.getAssetPrice(WBTC_ADDRESS),
      8
    )
  );
}

main();
