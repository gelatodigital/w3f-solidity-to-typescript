# Web3 Functions Solidity-->Typescript template <!-- omit in toc -->

This template helps to understand the simple steps to convert solidity functions/transactions into typescript functions.

## Transactions

We define transactions as the executions that will always be pushed on-chain depending only on the trigger.

The example can be found [here](./web3-functions/solidity-to-ts-tx/index.ts).

We will have to do two steps to convert the solidity function to typescript:
- Please add the target contract in the [userArgs.json](./web3-functions/solidity-to-ts-tx/userArgs.json) file
- update the ABI and method to execute on lines [7](./web3-functions/solidity-to-ts-tx/index.ts#L7) and [25](./web3-functions/solidity-to-ts-tx/index.ts#L25)


## Resolvers

We define resolvers as the executions that require specific conditions that will be checked with a resolver/checker method and will return:

```typescript
canExec:boolean // if the conditions are met to execute
execPayload:bytes // the payload to execute if canExex == true
```

The example can be found [here](./web3-functions//solidity-to-ts-resolver/index.ts).

The two steps to convert will be:
- update the [userArgs.json](./web3-functions//solidity-to-ts-resolver/userArgs.json) adding the resolver and target addresses
- update the ABI and method to execute on lines [7](./web3-functions/solidity-to-ts-resolver/index.ts#L7) and [26](./web3-functions/solidity-to-ts-resolver/index.ts#L26)


## Notification when an execution reverts

We have also included an example of using callbacks when a transaction reverts.
Please see code [here](./web3-functions/solidity-to-ts-tx-callback/index.ts)


## Testing
e.g to test the `solidity-to-ts-tx` we will add the RPC of the chain we are testing on PROVIDE_URLS.

Then please add the user arguments into the `userArgs.json` file, and then:

```typescript
 npx w3f test web3-functions/solidity-to-ts-tx/index.ts --logs --chain-id=5  
```

Result:
```typescript
Web3Function building...

Web3Function Build result:
 ✓ Schema: web3-functions/solidity-to-ts-tx/schema.json
 ✓ Built file: /Users/javiermac/Documents/GELATO/USER-REPOS/dukata/.tmp/index.js
 ✓ File size: 0.63mb
 ✓ Build time: 72.04ms

Web3Function user args validation:
 ✓ target: 0xcc2894fa3062212733608ac28f9d2831f6f7f498

Web3Function running logs:

Web3Function onRun result:
 ✓ Return value: {"canExec":true,"callData":[{"to":"0xcc2894fa3062212733608ac28f9d2831f6f7f498","data":"0x720b5b6f"}]}

Web3Function Runtime stats:
 ✓ Duration: 0.30s
 ✓ Memory: 63.19mb
 ✓ Storage: 0.04kb
 ✓ Network: 0 req [ DL: 0.00kb / UL:  0.00kb]
 ✓ Rpc calls: 0
```

## Deploy
The first step is to deploy the typescript code to IPFS with
```
 npx w3f deploy web3-functions/solidity-to-ts-tx/index.ts
```

Result:
```typescript
 ✓ Web3Function deployed to ipfs.
 ✓ CID: QmQDEca8G3hJ1KuFhLbh7BfECMRjBTobaUiAQaBEo1NNqf

To create a task that runs your Web3 Function every minute, visit:
> https://beta.app.gelato.network/new-task?cid=QmQDEca8G3hJ1KuFhLbh7BfECMRjBTobaUiAQaBEo1NNqf
```


## Task Creation
Please click on the above URL and follow the steps till the creation of the task.
Alternatively, you can create a task by visiting [https://app.gelato.network](https://app.gelato.network).