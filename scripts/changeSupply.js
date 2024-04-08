//NOT IMPORTANT

const { BigNumber, ethers } = require("hardhat");
const wbtc_abi = require("../src/WBTC.json");
const fetchPrice = require("./fetchPrice");
require("dotenv").config();

async function main() {
  const wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  const WBTC_Owner = "0xCA06411bd7a7296d7dbdd0050DFc846E95fEBEB7";
  const WBTC_OWNER_signer = await ethers.getSigner(WBTC_Owner);
  const wbtcContract = new ethers.Contract(
    wbtc_address,
    wbtc_abi,
    WBTC_OWNER_signer
  );
  const suupply_slot = "0x1";
  const updatedSupply = ethers.utils.hexlify(
    ethers.utils.zeroPad(14526689789822, 32)
  );
  console.log("WBTC owner before:", await provider.getBalance(WBTC_Owner));
  console.log("Price of WBTC:", await fetchPrice());
  console.log("Supply WBTC Before:", await wbtcContract.totalSupply());

  await network.provider.send("hardhat_setBalance", [
    WBTC_Owner,
    "0x92AB2594F2420",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WBTC_Owner],
  });

  console.log("WBTC OWNER ETH Balance:", await provider.getBalance(WBTC_Owner));

  await ethers.provider.send("hardhat_setStorageAt", [
    wbtc_address,
    suupply_slot,
    updatedSupply,
  ]);

  //   const txn = await wbtcContract
  //     .connect(WBTC_OWNER_signer)
  //     .mint(vitalik_address, vitalik_Balance * 100, {
  //       gasLimit: 100000,
  //     });
  //   await txn.wait();

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [WBTC_Owner],
  });

  console.log("Supply WBTC after:", await wbtcContract.totalSupply());
  console.log("Price of WBTC after:", await fetchPrice());

  await network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl:
            "https://eth-mainnet.alchemyapi.io/v2/7dPsv4k9QI6KAuCyfQSF3tzdY7coYthq",
          blockNumber: 18589542,
        },
      },
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
