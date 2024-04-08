# STEPS TO REPRODUCE WORKFLOW:

0. Refer to [notes.md](./NOTES.md) for some brief about the setup
1. Run the fork:`npx hardhat node`
2. In a new terminal, check user data before price drop: `npx hardhat run scripts/fetchHealthFactor.js --network localhost`
3. Check price of wbtc before drop: `npx hardhat run scripts/fetchPrice.js --network localhost`
4. Deploy dummy oracle: `npx hardhat run scripts/sample-script.js --network localhost`
5. Manipulate Aave WBTC Oracle: `npx hardhat run scripts/testOracle.js --network localhost`
6. check user data after price drop: `npx hardhat run scripts/fetchHealthFactor.js --network localhost`
7. Check price of wbtc after drop: `npx hardhat run scripts/fetchPrice.js --network localhost`
8. Liquidate user: Depending on which user you would like to liquidate, run: `npx hardhat run scripts/liquidate/address<i>.js --network localhost`
9. The following address cannot be liquidated because even after 50% price drop, their HF>1:[3,4,5,7,8,14,15,16,17]
10. Its best to reset the fork after liquidating a user. For this run: `npx hardhat run scripts/resetFork.js --network localhost` and rerun from point 2.

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

ADDRESSES:
"0x2d1a5c2269237cf98f7d5dafe1bef2f9fed4f1d9", //1 DONE
"0x0640b8b780c641ab20f50955b1ace5d9df7fbdba", //2 DONE
"0xd90c42a0eca1f97315f072e45533572f8bf07a10", //3 DONE
"0x582d88d3870d61aa2be2abf567d45ba5f7047397", //4 DONE
"0xf24a872344d7e78e6f9895a57b672d93f29d3100", //5 DONE
"0xcb33ea36eefe670ef33a0f9435cb04b6a30a33fd", //6 DONE
"0x0591772c7b4bded578bb5f17f689efe3be8c40c5", //7 DONE
"0x443648884a3b07ab6feb9b0bdc491a2aa16dd5d4", //8 DONE
"0x890e0ca73ec07dd6b3219b998ab7f4e421870ead", //9 DONE
"0x122e2cd153a58ba06c79ef0384d6a696a93d0ab6", //10 DONE
"0x61227bac9fd51ace4bbadb25b21e723129f1e3c7", //11 DONE
"0x2d1a5c2269237cf98f7d5dafe1bef2f9fed4f1d9", //12 DONE
"0x57331dcf0ee5c1156a86fce57536556785456b1a", //13 DONE
"0x6797761f6aa856a3b66efe65fc8ff3f28180dffb", //14 DONE
"0xd010fefc0682fa894cd47afc550e8cec815debf2", //15 DONE
"0x9ff8efcc3bd7910ce7ceef21e52be606416164f1", //16 DONE
"0x748b0d01a4aec6eec69111cf9db5078b02d487e5", //17 DONE
"0xe43e9101c63af97c55fccc790641a8274a491303", //18 DONE
"0xaaba8dc6ea216bed8e27ff4c4fdef1179fb33820", //19 DONE

POOL_ADMIN=0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A

AFTER 50% DROP HF:
0.888828777418886825 //1 - DONE
0.887522279383646385 //2 - DONE
1.685386736612104584 //3 -DONE
1.241409796066006088 //4 -DONE
2.006917199784106006 //5 -DONE
0.984955437024471069 //6 -DONE
1.879882477105816803 //7 -DONE
1.671052214111065081 //8 -DONE
0.927631255437196621 //9 -DONE
0.539644266363834873 //10 -DONE
0.778072018604198864 //11 -DONE
0.888828777418886825 //12 -DONE
0.703074831915843074 //13 -DONE
1.010304569694651688 //14 -DONE
1.344636949890178922 //15 -DONE
2.43972596521825365 //16 -DONE
1.930689364732136175 //17 -DONE
0.881934392200715272 //18 -DONE
0.986771041267879465 //19 -DONE

0x582d88D3870D61aa2BE2Abf567d45BA5f7047397:

npx hardhat run scripts/fetchHealthFactor.js --network
localhost
