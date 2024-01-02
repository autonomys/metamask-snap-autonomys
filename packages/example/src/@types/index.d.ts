import type { SnapConfig } from '@subspace/metamask-subspace-types';

declare module '@subspace/metamask-subspace-adapter' {
  export function injectMetamaskSubspaceSnapProvider(
    network: 'gemini-3f' | 'gemini-3g' | 'devnet',
    config?: SnapConfig,
    pluginOrigin?: string
  ): void;
}
