import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "@ethersproject/contracts";

const TARGET_ABI = ["function check() external view  returns (bool canExec, bytes memory execPayload)"];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;

  const provider = multiChainProvider.default();

  // Retrieve target address
  const targetAddress = userArgs.target as string;
  const resolverAddress = userArgs.target as string;

  let resolver;
  try {
    resolver = new Contract(resolverAddress, TARGET_ABI, provider);
  } catch (err) {
    return { canExec: false, message: `Rpc call failed` };
  }

  // Get resutls from resolver calling the checker method (the thecker method can have any name)
  const check = await resolver.check();

  if (!check.canExec) {
    return { canExec: false, message: `!canExec` };
  }

  return {
    canExec: true,
    callData: [
      {
        to: targetAddress,
        data: check.execPayload,
      },
    ],
  };
});
