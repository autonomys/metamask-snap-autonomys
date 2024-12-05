import type { ApiPromise } from '@polkadot/api/';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxPayload } from '@subspace/metamask-subspace-types';
import { getAddress } from './getAddress';

export async function generateNominateOperatorPayload(
  api: ApiPromise,
  operatorId: string,
  amount: string | number
): Promise<TxPayload> {
  // fetch last signed block and account address
  const [signedBlock, address] = await Promise.all([api.rpc.chain.getBlock(), getAddress()]);
  // create signer options
  const nonce = (await api.derive.balances.account(address)).accountNonce;
  const signerOptions = {
    blockHash: signedBlock.block.header.hash,
    era: api.createType('ExtrinsicEra', {
      current: signedBlock.block.header.number,
      period: 50
    }),
    nonce
  };
  // define transaction method
  const transaction: SubmittableExtrinsic<'promise'> = api.tx.domains.nominateOperator(
    operatorId,
    amount
  );

  // create SignerPayload
  const signerPayload = api.createType('SignerPayload', {
    genesisHash: api.genesisHash,
    runtimeVersion: api.runtimeVersion,
    version: api.extrinsicVersion,
    ...signerOptions,
    address: '0x0000000',
    blockNumber: signedBlock.block.header.number,
    method: transaction.method,
    signedExtensions: [],
    transactionVersion: transaction.version
  });

  return {
    payload: signerPayload.toPayload(),
    tx: transaction.toHex()
  };
}