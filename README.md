# UpFile

## Upload files into the BitcoinSV blockchain network

```
npm install upfile-builder
```

### First, create pay script handler to pass into upfile write method.

```js
const { HandCashConnect } = require('@handcash/handcash-connect');

const authToken = 'AUTH_TOKEN';
const handcash = new HandCashConnect({
  appId: 'APP_ID',
  appSecret: 'APP_SECRET'
});

async function payScriptHandler(script) {
  const account = handcash.getAccountFromAuthToken(authToken);
  const paymentParameters = {
    payments: [],
    attachment: {
      format: 'hex',
      value: script
    }
  };

  const result = await account.wallet.pay(paymentParameters);
  if (result && result.transactionId) {
    return result.transactionId;
  }
  throw result;
}
```

### Import the module and upload the first file into BSV blockchain network.

```js
const { write } = require('upfile-builder');

const filePath = '/home/Learning-Video.mp4'; //Path of the file
const fileName = 'Learning-Video.mp4'; //Show in transaction
const chunkSize = 50 * 1024; //50KB
const mimeType = 'auto'; //Auto set of mimetype by the file extension

const result = await write(filePath, fileName, mimeType, chunkSize, payScriptHandler);

console.log(result);
```

```js
{
  key: 'c72a9bb151e97589a788e4fabb5e0139773a47860a4a36b17995ab24bf1d90e7',
  filename: 'Learning-Video.mp4',
  mime: 'video/mp4',
  size: 5220484
};
```
