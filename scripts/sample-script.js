//DEPLOY DUMMY ORACLE
const hre = require("hardhat");

async function main() {
  const PriceContract = await hre.ethers.getContractFactory("Oracle");
  const price = await PriceContract.deploy();

  await price.deployed();

  console.log("price deployed to:", price.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
