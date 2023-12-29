import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "@ethersproject/contracts";

const TARGET_ABI = ["function updateTwaps() external"];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;

  const provider = multiChainProvider.default();

  // Retrieve target address
  const targetAddress = userArgs.target as string;

  let target;
  try {
    target = new Contract(targetAddress, TARGET_ABI, provider);
  } catch (err) {
    return { canExec: false, message: `Rpc call failed` };
  }

  // Get data to execute
  const payload = target.interface.encodeFunctionData("updateTwaps");

  return {
    canExec: true,
    callData: [
      {
        to: targetAddress,
        data: payload,
      },
    ],
  };
});
