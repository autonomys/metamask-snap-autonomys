import type { SnapConfig } from '@subspace/metamask-subspace-types';
import { getMetamaskState } from '../rpc/getMetamaskState';
import {
  defaultConfiguration,
  gemini3gConfiguration,
  gemini3fConfiguration,
  devnetConfiguration
} from './predefined';

export function getDefaultConfiguration(networkName: string): SnapConfig {
  switch (networkName) {
    case 'gemini-3g':
      console.log('Gemini-3g configuration selected');
      return gemini3gConfiguration;
    case 'gemini-3f':
      console.log('Gemini-3f configuration selected');
      return gemini3fConfiguration;
    case 'devnet':
      console.log('devnet configuration selected');
      return devnetConfiguration;
    default:
      return defaultConfiguration;
  }
}

export async function getConfiguration(): Promise<SnapConfig> {
  const state = await getMetamaskState();

  if (!state || !state.config) {
    return defaultConfiguration;
  }
  return JSON.parse(<string>state.config) as SnapConfig;
}
