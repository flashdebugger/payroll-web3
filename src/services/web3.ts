import Web3 from 'web3';

declare let window: any;
let web3: Web3;

if (window.web3 === undefined) {
  web3 = new Web3('wss://mainnet.infura.io/ws');
} else {
  web3 = new Web3(window.web3.currentProvider);
}

export default web3;
