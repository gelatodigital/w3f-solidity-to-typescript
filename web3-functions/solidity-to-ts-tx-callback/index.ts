import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionFailContext,
  Web3FunctionSuccessContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "@ethersproject/contracts";
import ky from "ky"; // we recommend using ky as axios doesn't support fetch by default

interface SendmailOptions {
  apikey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}

// Function to send email alerts using SendGrid
async function sendmail(options: SendmailOptions) {
  try {
    await ky.post("https://api.sendgrid.com/v3/mail/send", {
      headers: {
        Authorization: `Bearer ${options.apikey}`,
        "Content-Type": "application/json",
      },
      json: {
        personalizations: [{ to: [{ email: options.to }] }],
        from: { email: options.from },
        subject: options.subject,
        content: [{ type: "text/plain", value: options.text }],
      },
    });
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

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
        data: payload
      },
    ],
  };
});

//Web3 Function onSuccess callback
Web3Function.onSuccess(async (context: Web3FunctionSuccessContext) => {
  const { userArgs, storage, transactionHash } = context;

  console.log("execution succeed");
});

//Web3 Function onFail callback
Web3Function.onFail(async (context: Web3FunctionFailContext) => {
  const { userArgs, reason, secrets } = context;

  const apikey = (await secrets.get("SENGRID_API")) as string;
  const from = (await secrets.get("FROM_EMAIL")) as string;
  const to = (await secrets.get("TO_EMAIL")) as string;

  let alertMessage = `Web3 Function Failed. Reason: ${reason}`;
  console.log("userArgs: ", userArgs.canExec);

  if (reason === "ExecutionReverted") {
    alertMessage += ` TxHash: ${context.transactionHash}`;
    console.log(`onFail: ${reason} txHash: ${context.transactionHash}`);
  } else if (reason === "SimulationFailed") {
    alertMessage += ` callData: ${JSON.stringify(context.callData)}`;
    console.log(
      `onFail: ${reason} callData: ${JSON.stringify(context.callData)}`
    );
  } else {
    console.log(`onFail: ${reason}`);
  }

  const mailOptions: SendmailOptions = {
    apikey: apikey,
    from: from,
    to: to,
    subject: "Web3 Function Execution Failure",
    text: alertMessage,
  };
  await sendmail(mailOptions);
});
