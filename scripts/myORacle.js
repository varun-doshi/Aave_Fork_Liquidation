const { ethers } = require("hardhat");
const address = "0x55027d3dBBcEA0327eF73eFd74ba0Af42A13A966";
const OracleABI = require("../src/myOracle.json");
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

async function main() {
  const contract = new ethers.Contract(address, OracleABI, provider);
  console.log(await contract.getAssetPrice());
}
main();
