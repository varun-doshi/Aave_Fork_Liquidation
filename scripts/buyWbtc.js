const { BigNumber, ethers } = require("hardhat");
const wbtc_abi = require("../src/WBTC.json");
const fetchPrice = require("./fetchPrice");
require("dotenv").config();

async function main() {
  const vitalik_address = "0x582d88D3870D61aa2BE2Abf567d45BA5f7047397";
  const wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const my_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  // //  impersonating vitalik's account
  // await hre.network.provider.request({
  //   method: "hardhat_impersonateAccount",
  //   params: [vitalik_address],
  // });

  const signer = await ethers.getSigner(vitalik_address);

  const wbtcContract = new ethers.Contract(wbtc_address, wbtc_abi, signer);
  const vitalik_Balance = await wbtcContract.balanceOf(vitalik_address);
  console.log(vitalik_Balance);
  const vitalik_ETH_Balance = await provider.getBalance(vitalik_address);

  const WBTC_Owner = "0xCA06411bd7a7296d7dbdd0050DFc846E95fEBEB7";
  const WBTC_OWNER_signer = await ethers.getSigner(WBTC_Owner);
  console.log("WBTC owner before:", await provider.getBalance(WBTC_Owner));
  console.log("Price of WBTC:", await fetchPrice());
  // console.log(await wbtcContract.owner());

  await network.provider.send("hardhat_setBalance", [
    WBTC_Owner,
    "0x92AB2594F2420",
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WBTC_Owner],
  });

  console.log("WBTC OWNER ETH Balance:", await provider.getBalance(WBTC_Owner));

  const txn = await wbtcContract
    .connect(WBTC_OWNER_signer)
    .mint(vitalik_address, vitalik_Balance * 100, {
      gasLimit: 100000,
    });
  await txn.wait();

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [WBTC_Owner],
  });

  console.log("Price of WBTC AFTER:", await fetchPrice());
  console.log("Before WBTC:", vitalik_Balance / 1e8);
  console.log("ETH Before vitalik:", vitalik_ETH_Balance / 1e18);
  console.log("Before My:", await wbtcContract.balanceOf(my_address));

  const buyUnits = ethers.utils.parseUnits("0.1", 8);
  // transferring ETH
  //ethers.BigNumber.from(10)
  console.log(ethers.utils.parseUnits("0.1", 8));

  // const txn = await wbtcContract.connect(signer).burn(vitalik_Balance, {
  //   gasLimit: 100000,
  // });
  // await txn.wait();

  const vitalik_Balance_after = await wbtcContract.balanceOf(vitalik_address);
  console.log("After WBTC:", vitalik_Balance_after / 1e8);
  console.log("After My:", await wbtcContract.balanceOf(my_address));

  //   if ((await wbtcContract.balanceOf(my_address)) == vitalik_Balance) {
  //     console.log(
  //       `Wohoo!! You now have ${ethers.utils.formatEther(
  //         vitalik_Balance
  //       )} UNI Tokens!`
  //     );
  //   }

  await network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
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
