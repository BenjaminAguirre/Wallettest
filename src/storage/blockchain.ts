// import { backends } from './backends';


const flux = {
    id: 'flux',
    libid: 'flux',
    name: 'Flux',
    symbol: 'FLUX',
    decimals: 8,
    // node: backends().flux.node,
    slip: 19167,
    scriptType: 'p2sh',
    messagePrefix: '\u0018Zelcash Signed Message:\n',
    pubKeyHash: '1cb8',
    scriptHash: '1cbd',
    wif: '80',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    txVersion: 4,
    txGroupID: 0x892f2085,
    backend: 'insight',
    dustLimit: 546, // min utxo amount
    minFeePerByte: 1, // min fee per byte
    feePerByte: 1, // fee per byte
    maxMessage: 80, // 80 bytes in size
    maxTxSize: 1800000, // 1,800,000 vbytes
    rbf: false,
    txExpiryHeight: 30, // 30 blocks, 1 hour
  };
  
  const fluxTestnet = {
    id: 'fluxTestnet',
    libid: 'fluxtestnet',
    name: 'Testnet Flux',
    symbol: 'TEST-FLUX',
    decimals: 8,
    // node: backends().fluxTestnet.node,
    slip: 1, // all testnets have 1
    scriptType: 'p2sh',
    messagePrefix: '\u0018Zelcash Signed Message:\n',
    pubKeyHash: '1d25',
    scriptHash: '1cba',
    wif: 'ef',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    txVersion: 4,
    txGroupID: 0x892f2085,
    backend: 'insight',
    dustLimit: 546, // min utxo amount
    minFeePerByte: 1, // min fee per byte
    feePerByte: 1, // fee per byte
    maxMessage: 80, // 80 bytes in size
    maxTxSize: 1800000, // 1,800,000 vbytes
    rbf: false,
    txExpiryHeight: 30, // 30 blocks, 1 hour
  };


  export interface FluxNetwork {
    id: string;
    libid: string;
    name: string;
    symbol: string;
    decimals: number;
    node: string;
    slip: number;
    scriptType: string;
    messagePrefix: string;
    pubKeyHash: string;
    scriptHash: string;
    wif: string;
    bip32: {
      public: number;
      private: number;
    };
    txVersion: number;
    txGroupID: number;
    backend: string;
    dustLimit: number;
    minFeePerByte: number;
    feePerByte: number;
    maxMessage: number;
    maxTxSize: number;
    rbf: boolean;
    txExpiryHeight: number;
  }

  // Configuración centralizada de Flux
  export const fluxNetwork = {
    mainnet: flux,
    testnet: fluxTestnet
  } as const;