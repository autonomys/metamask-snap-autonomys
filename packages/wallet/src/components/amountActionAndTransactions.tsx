import { CopyIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Heading,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useToast
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { EXTERNAL_ROUTES } from '../constants'
import { useWallet } from '../hooks/useWallet'
import { useView } from '../states/view'
// import { ConnectWalletButton } from './buttons/walletButton'
import { Receive } from './modals/receive'
import { Send } from './modals/send'
import { TokensList } from './tokensList'
import { TransactionsList } from './transactionsList'

const ConnectWalletButton = dynamic(() => import('./buttons/walletButton').then((m) => m.ConnectWalletButton), {
  ssr: false
})

interface AmountActionAndTransactionsProps {
  isReceiveOpen: boolean
  isSendOpen: boolean
  onReceiveOpen: () => void
  onSendOpen: () => void
  onReceiveClose: () => void
  onSendClose: () => void
}

export const AmountActionAndTransactions: React.FC<AmountActionAndTransactionsProps> = ({
  isReceiveOpen,
  isSendOpen,
  onReceiveOpen,
  onSendOpen,
  onReceiveClose,
  onSendClose
}) => {
  const { network } = useView()
  const { push, query } = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [tabsIndex, setTabsIndex] = useState(0)
  const toast = useToast()
  const { walletBalance, walletBalanceFormatted, walletLabel, address, isConnected } = useWallet(network)

  const handleCopyAddress = useCallback(() => {
    address && navigator.clipboard.writeText(address)
    toast({
      title: 'Address copied',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
  }, [address])

  const showFaucetLink = useMemo(() => network === 'evm' && parseFloat(walletBalance) <= 0.05, [walletBalance])

  const handleTabChange = useCallback((index: number) => {
    switch (index) {
      case 0:
        push('/wallet/evm/tokens')
        break
      case 1:
        push('/wallet/evm/transactions')
        break
      default:
        break
    }
    setTabsIndex(index)
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (query.walletType === 'tokens') {
      setTabsIndex(0)
    } else if (query.walletType === 'transactions') {
      setTabsIndex(1)
    }
  }, [query.walletType])

  return (
    <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch' m='2'>
      <Box h='10vh'>
        <Center>
          <VStack>
            {isConnected ? (
              <>
                <Button
                  colorScheme='brand'
                  rightIcon={isConnected ? <CopyIcon /> : undefined}
                  variant='outline'
                  onClick={handleCopyAddress}>
                  {walletLabel}
                </Button>
                <Heading size='lg'>{walletBalanceFormatted} tSSC</Heading>
                {showFaucetLink && (
                  <Box mt='1'>
                    <Link href={EXTERNAL_ROUTES.SUBSPACE_FAUCET} target='_blank'>
                      Use the Faucet to get some testnet tokens
                    </Link>
                  </Box>
                )}
                <Box mt='2'>
                  <Button colorScheme='brand' mr='12' onClick={onReceiveOpen}>
                    Receive
                  </Button>
                  <Button colorScheme='brand' onClick={onSendOpen}>
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <ConnectWalletButton />
            )}
          </VStack>
        </Center>
        <Receive isOpen={isReceiveOpen} onClose={onReceiveClose} />
        <Send isOpen={isSendOpen} onClose={onSendClose} />
      </Box>
      {isClient && (
        <Box mt={showFaucetLink ? 6 : 2} h='40px'>
          {network === 'evm' ? (
            <Tabs
              size='sm'
              variant='soft-rounded'
              colorScheme='brand'
              isFitted
              mt={6}
              overflowX='scroll'
              h={'200px'}
              maxH='200px'
              onChange={handleTabChange}
              index={tabsIndex}>
              <TabList>
                <Tab>Tokens</Tab>
                <Tab>Transactions</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <TokensList />
                </TabPanel>
                <TabPanel overflowX='scroll' h={360}>
                  <TransactionsList address={address} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Box overflowX='scroll' h={360}>
              <TransactionsList address={address} />
            </Box>
          )}
        </Box>
      )}
    </VStack>
  )
}
