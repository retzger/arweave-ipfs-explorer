
# arweave-Ipfs explore

>Permaweb Explorer for fetching and storing ipfs data into Arweave Blockchain

It uses [arweave-ipfs](https://github.com/imerkle/arweave-ipfs)(serverless) and [arweave-ipfs-server](https://github.com/imerkle/arweave-ipfs-server)(server-backed) at it's core.

This explorer works similar to the other ipfs api for example infura, globalupload 

https://ipfs.infura.io/ipfs/QmTAznyH583xUgEyY5zdrPB2LSGY7FUBPDddWKj58GmBgp

https://ipfs.globalupload.io/QmTAznyH583xUgEyY5zdrPB2LSGY7FUBPDddWKj58GmBgp


# Serverless Arweave-Ipfs Explorer

This is a server-less permaweb explorer. It only fetches ipfs data. It uses [arweave-ipfs](https://github.com/imerkle/arweave-ipfs) to fetch data.

https://arweave.net/2qTbAbUebhqmsgmV5_YAPr3F77bfmxCBm4nzDlAI4ps

#### Examples

https://arweave.net/2qTbAbUebhqmsgmV5_YAPr3F77bfmxCBm4nzDlAI4ps#Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a

https://arweave.net/2qTbAbUebhqmsgmV5_YAPr3F77bfmxCBm4nzDlAI4ps#QmQeEyDPA47GqnduyVVWNdnj6UBPXYPVWogAQoqmAcLx6y

https://arweave.net/2qTbAbUebhqmsgmV5_YAPr3F77bfmxCBm4nzDlAI4ps#QmTAznyH583xUgEyY5zdrPB2LSGY7FUBPDddWKj58GmBgp


# Server-backed Arweave-Ipfs Explorer

This is a server-backed permaweb explorer. It fetches and also stores ipfs data. It's backed by a [server](https://github.com/imerkle/arweave-ipfs-server) currently hosted @https://3b565264.ngrok.io

https://arweave.net/EKpXiUIa5AY6EiufApjQyPOIOY8Qf3NVAefPbVW_dmo

###### Note: A centralized server can be down anytime therefore it's no guarantee the links will work forever. It's reccommended to use Server-less Explorer

#### Examples

https://arweave.net/EKpXiUIa5AY6EiufApjQyPOIOY8Qf3NVAefPbVW_dmo#Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a

https://arweave.net/EKpXiUIa5AY6EiufApjQyPOIOY8Qf3NVAefPbVW_dmo#QmQeEyDPA47GqnduyVVWNdnj6UBPXYPVWogAQoqmAcLx6y

https://arweave.net/EKpXiUIa5AY6EiufApjQyPOIOY8Qf3NVAefPbVW_dmo#QmTAznyH583xUgEyY5zdrPB2LSGY7FUBPDddWKj58GmBgp



## Setup

 - `git clone https://github.com/imerkle/arweave-ipfs-explorer`
 - `cd arweave-ipfs-explorer`
 - `yarn install`
 - `yarn run start`

 Modify `src/constants.js` for configuration
```js
//for server-less build
 const API=""
 //for server-backed build
 const API="your-server-url"

//max bytes to display in browser
//files larger than this will be downloaded instead
//defaults to 10MB
const MAX_SIZE_SHOW = 10000000;
 ```
