import { Button, Text, useToast } from '@chakra-ui/react'
import { ApiPromise } from '@polkadot/api'
import { WsProvider } from '@polkadot/rpc-provider'
import { enableSubspaceSnap } from '@subspace/metamask-subspace-adapter'
import type { MetamaskSubspaceSnap } from '@subspace/metamask-subspace-adapter/build/snap'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SnapContextProvider } from '../../context/snapProvider'
import { useExtension, useLastConnection, useTransactions } from '../../states/extension'
import { useWallet } from '../../states/wallet'
import { MetaMask } from '../icons'

export const defaultSnapId = 'local:http://localhost:8081'

interface SnapConnectorButtonProps {
  onClick?: () => void
  onClose?: () => void
}

export const SnapConnectorButton: React.FC<SnapConnectorButtonProps> = ({ onClick, onClose }) => {
  const toast = useToast()
  const { address } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { transactions, addTransactionToWatch } = useTransactions()
  const { disconnectAsync } = useDisconnect()
  const { enableSnap } = useWallet()
  const { api, extension, setMMApi, setExtension, setSubspaceAccount } = useExtension()
  const { subspaceAccount: lastSubspaceAccount, setSubspaceAccount: setLastSubspaceAccount } = useLastConnection()

  const installSubspaceSnap = useCallback(async (): Promise<{
    isSnapInstalled: boolean
    snap?: MetamaskSubspaceSnap
  }> => {
    const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
    try {
      try {
        disconnectAsync && (await disconnectAsync())
      } catch (e) {
        console.error('e', e)
      }
      try {
        const connector = connectors.find((c) => c.id === 'metaMask')
        connector && (await connectAsync({ connector }))
      } catch (e) {
        console.error('e', e)
      }
      const snap = await enableSubspaceSnap({ networkName: 'gemini-3g' }, snapId)
      toast({
        title: 'MetaMask Snap installed',
        description: 'You can now use MetaMask Snap to connect to Subspace.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      const mmApi = snap.getMetamaskSnapApi()
      const address = await mmApi.getAddress()
      const allTx = await mmApi.getAllTransactions()

      for (const tx of allTx) {
        const isAlreadyWatched = transactions.find((t) => t.extrinsicHash === tx.hash)
        if (!isAlreadyWatched)
          addTransactionToWatch('consensus', {
            chainId: 0,
            extrinsicHash: tx.hash,
            method: '',
            sender: tx.sender,
            value: tx.amount as string,
            fromBlockNumber: 0,
            fromBlockHash: '0x0'
          })
      }

      setSubspaceAccount(address)
      setLastSubspaceAccount(address)
      setMMApi(mmApi)
      setExtension({
        error: null,
        loading: false,
        data: {
          accounts: extension.data
            ? [
                ...extension.data.accounts,
                {
                  address: address,
                  meta: {
                    name: 'MetaMask',
                    source: 'metamask',
                    genesisHash: '0x0000000'
                  },
                  type: 'sr25519'
                }
              ]
            : [
                {
                  address: address,
                  meta: {
                    name: 'MetaMask',
                    source: 'metamask',
                    genesisHash: '0x0000000'
                  },
                  type: 'sr25519'
                }
              ],
          defaultAccount: {
            address: address,
            meta: {
              name: 'MetaMask',
              source: 'metamask',
              genesisHash: '0x0000000'
            },
            type: 'sr25519'
          }
        }
      })

      return { isSnapInstalled: true, snap }
    } catch (err) {
      console.error('SnapConnectorButton-Error:', err)
      return { isSnapInstalled: false }
    }
  }, [
    addTransactionToWatch,
    api,
    connectAsync,
    connectors,
    disconnectAsync,
    extension.data,
    setExtension,
    setLastSubspaceAccount,
    setMMApi,
    setSubspaceAccount,
    toast,
    transactions
  ])

  const handleClick = useCallback(async () => {
    onClick && onClick()
    const installed = await installSubspaceSnap()
    console.log('installed', installed)
    if (installed.isSnapInstalled) {
      enableSnap(address)
    }
    if (installed) onClose && onClose()
  }, [onClick, onClose])

  return (
    <SnapContextProvider>
      <Button variant='outline' w='200px' borderColor='brand' onClick={async () => await handleClick()}>
        <MetaMask width='24px' />
        <Text ml='2'>MetaMask Snap</Text>
      </Button>
    </SnapContextProvider>
  )
}
