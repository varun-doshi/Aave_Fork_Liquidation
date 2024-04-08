//FETCH PRICE OF WBTC

const { ethers } = require("hardhat");
const AAVE_ORACLE_ABI = require("../src/aaveOracle.json");

const fetchPrice = async () => {
  const AAVE_ORACLE = "0x54586bE62E3c3580375aE3723C145253060Ca0C2";
  const WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  const contract = new ethers.Contract(AAVE_ORACLE, AAVE_ORACLE_ABI, provider);

  const wBtcPrice = await contract.getAssetPrice(WBTC_ADDRESS);
  console.log(wBtcPrice);
  const normalizedPrice = ethers.utils.formatUnits(wBtcPrice, 8);
  console.log(`${normalizedPrice} USD`);
};

async function main() {
  await fetchPrice();
}
main();

// module.exports = fetchPrice;
