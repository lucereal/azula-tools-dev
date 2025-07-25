import { ethers } from "hardhat";

const contractAddress = "YOUR_DEPLOYED_CONTRACT";
const abi = [
  "function buyAccess() external payable",
  "function hasAccess(address _user) public view returns (bool)",
  "function withdraw() external",
];

async function main() {
  const [user] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, abi, user);

  // Buy access
  const tx = await contract.buyAccess({ value: ethers.utils.parseEther("0.01") });
  await tx.wait();
  console.log("Access purchased");

  // Check access
  const hasAccess = await contract.hasAccess(user.address);
  console.log("User has access:", hasAccess);
}

main().catch(console.error);
