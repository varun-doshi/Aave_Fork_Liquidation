const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
require("dotenv").config();

async function main() {
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
  console.log("Fork reset successful");
}
main();
