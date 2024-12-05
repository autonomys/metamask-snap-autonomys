import type { SnapConfig } from '@subspace/metamask-subspace-types';
import {
  exportSeed,
  generateDeregisterOperatorPayload,
  generateNominateOperatorPayload,
  generateRegisterOperatorPayload,
  generateTransactionPayload,
  generateWithdrawStakePayload,
  getAddress,
  getAllTransactions,
  getBalance,
  getLatestBlock,
  getPublicKey,
  sendSignedData,
  setConfiguration,
  signPayloadJSON,
  signPayloadRaw
} from './methods';
import type { MetamaskSnapApi } from './types';

export class MetamaskSubspaceSnap {
  protected readonly config: SnapConfig;
  //url to package.json
  protected readonly pluginOrigin: string;
  //pluginOrigin prefixed with wallet_plugin_
  protected readonly snapId: string;

  public constructor(pluginOrigin: string, config: SnapConfig) {
    this.pluginOrigin = pluginOrigin;
    this.snapId = `${this.pluginOrigin}`;
    this.config = config || { networkName: 'gemini-3g' };
  }

  public getMetamaskSnapApi = (): MetamaskSnapApi => {
    return {
      exportSeed: exportSeed.bind(this),
      generateTransactionPayload: generateTransactionPayload.bind(this),
      generateRegisterOperatorPayload: generateRegisterOperatorPayload.bind(this),
      generateDeregisterOperatorPayload: generateDeregisterOperatorPayload.bind(this),
      generateNominateOperatorPayload: generateNominateOperatorPayload.bind(this),
      generateWithdrawStakePayload: generateWithdrawStakePayload.bind(this),
      getAddress: getAddress.bind(this),
      getAllTransactions: getAllTransactions.bind(this),
      getBalance: getBalance.bind(this),
      getLatestBlock: getLatestBlock.bind(this),
      getPublicKey: getPublicKey.bind(this),
      send: sendSignedData.bind(this),
      setConfiguration: setConfiguration.bind(this),
      signPayloadJSON: signPayloadJSON.bind(this),
      signPayloadRaw: signPayloadRaw.bind(this)
    };
  };
}
