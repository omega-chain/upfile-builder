# UpFile

## Upload files into the BitcoinSV blockchain network with Upfile-builder
Upfile-builder is a package from the Upfile project which allows the services to upload files to the BSV blockchain. The Upfile-builder creates the required outputs for the transaction(s) and passes them to a handler. The handler is responsible for making the payment, broadcasting the transaction(s), and returning the transaction ID. This ID is the key to finding all the transactions. Below is an example that uses the upfile-builder with Handcash connect as a handler.

```
npm install upfile-builder
```

```js
// Import Handcash connect to handle the transactions.
const { HandCashConnect } = require("@handcash/handcash-connect");
// Import upfile-builder to upload files into BSV blockchain.
const { write } = require("upfile-builder"); // Import the module

const authToken = "AUTH_TOKEN"; // Replace with your auth token
const handcash = new HandCashConnect({
  appId: "APP_ID", // Replace with your app id
  appSecret: "APP_SECRET", // Replace with your app secret
});

async function payScriptHandler(script) {
  const account = handcash.getAccountFromAuthToken(authToken);
  const paymentParameters = {
    payments: [],
    attachment: {
      format: "hex",
      value: script,
    },
  };

  const result = await account.wallet.pay(paymentParameters);
  console.log(result); // to see the upload process in the console

  if (result && result.transactionId) {
    return result.transactionId;
  }
  throw result;
}

const filePath = "/path/to/the/file/IMG_1866.JPG"; //Path of the file(any format)
const fileName = "IMG_1866.JPG"; //The file name Shown in the transaction

// specify the transaction chunk size in bytes(size of each transaction if the file is more than chunk size)
const chunkSize = 50 * 1024; //50KB
const mimeType = "auto"; //Auto set of mimetype by the file extension

async function main() {
  // Upload the file by passing it to the handler function and wait for the result;
  const result = await write(
    filePath,
    fileName,
    mimeType,
    chunkSize,
    payScriptHandler
  );

  console.log(result);
}

main();

/*
Result:
{
  key: '0f6f603b18f87921c28cc1ab1ac0f4028449aca6be26bd9d5cda388e0e22d648',
  filename: 'IMG_1866.JPG',
  mime: 'image/jpeg',
  size: 3252913
}

File can be accessed by hosting Upfile-server or using our instance on https://cdn.upfile.space

i.e. 
https://cdn.upfile.space/<key>
https://cdn.upfile.space/0f6f603b18f87921c28cc1ab1ac0f4028449aca6be26bd9d5cda388e0e22d648
*/

```
