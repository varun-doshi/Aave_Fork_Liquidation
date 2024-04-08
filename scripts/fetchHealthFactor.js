//FETCH HEALTH FACTOR OF ALL USERS

const { ethers } = require("ethers");
const AAVE_POOL_ABI = require("../src/aavePoolABI.json");

const fetchHealthFactor = async () => {
  const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
  let result = [];

  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );

  //   const provider = new ethers.JsonRpcProvider(
  //     "https://eth-mainnet.g.alchemy.com/v2/7dPsv4k9QI6KAuCyfQSF3tzdY7coYthq"
  //   );
  const contract = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, provider);
  const ACCOUNTS = [
    "0x2d1a5c2269237cf98f7d5dafe1bef2f9fed4f1d9", //1
    "0x0640b8b780c641ab20f50955b1ace5d9df7fbdba", //2
    "0xd90c42a0eca1f97315f072e45533572f8bf07a10", //3
    "0x582d88d3870d61aa2be2abf567d45ba5f7047397", //4
    "0xf24a872344d7e78e6f9895a57b672d93f29d3100", //5
    "0xcb33ea36eefe670ef33a0f9435cb04b6a30a33fd", //6
    "0x0591772c7b4bded578bb5f17f689efe3be8c40c5", //7
    "0x443648884a3b07ab6feb9b0bdc491a2aa16dd5d4", //8
    "0x890e0ca73ec07dd6b3219b998ab7f4e421870ead", //9
    "0x122e2cd153a58ba06c79ef0384d6a696a93d0ab6", //10
    "0x61227bac9fd51ace4bbadb25b21e723129f1e3c7", //11
    "0x2d1a5c2269237cf98f7d5dafe1bef2f9fed4f1d9", //12
    "0x57331dcf0ee5c1156a86fce57536556785456b1a", //13
    "0x6797761f6aa856a3b66efe65fc8ff3f28180dffb", //14
    "0xd010fefc0682fa894cd47afc550e8cec815debf2", //15
    "0x9ff8efcc3bd7910ce7ceef21e52be606416164f1", //16
    "0x748b0d01a4aec6eec69111cf9db5078b02d487e5", //17
    "0xe43e9101c63af97c55fccc790641a8274a491303", //18
    "0xaaba8dc6ea216bed8e27ff4c4fdef1179fb33820", //19
  ];
  for (let i = 0; i < ACCOUNTS.length; i++) {
    const userData = await contract.getUserAccountData(ACCOUNTS[i]);

    const data = {
      totalCollateralBase: ethers.utils.formatUnits(userData[0].toString(), 6),
      totalDebtBase: ethers.utils.formatUnits(userData[1].toString(), 6),
      healthFactor: ethers.utils.formatUnits(userData[5].toString(), 18),
      address: ACCOUNTS[i],
    };
    result.push(data);

    const normalizedUserData = ethers.utils.formatUnits(
      userData[1].toString(),
      6
    );
    if (
      normalizedUserData ==
      "115792089237316195423570985008687907853269984665640564039457.584007913129639935"
    ) {
      console.log("User has left the protocol");
    } else {
      continue;
    }
  }
  console.log(result);
};

async function main() {
  await fetchHealthFactor();
}
main();
