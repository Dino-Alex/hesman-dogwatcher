/* eslint-disable no-nested-ternary */
import React, { useMemo, useState, useEffect, useContext } from 'react'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Duration } from 'date-fns'
import styled from 'styled-components'
import {
  Text,
  Box,
  Heading,
  Card,
  Flex,
  Link as UIKitLink,
  LinkExternal,
  Spinner,
  Image,
  useMatchBreakpointsContext,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { getBscScanLink } from 'utils'
import useCMCLink from 'views/Info/hooks/useCMCLink'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import {
  usePoolDatas,
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
} from 'state/info/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { RefreshCreateGlobal } from 'components/Menu/GlobalSettings/SettingsModal'
import { useWatchlistTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { useTranslation } from '@pancakeswap/localization'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import { RefreshDeleteGlobal } from './Modal/ModalDelete'
import { FetchCirculatingSupply, fetchTotalSuppy } from '../hooks/useTotalSupply'
import TeamWalletTable from '../components/InfoTables/TeamWalletTable'
import TrackingWalletTable from '../components/InfoTables/TrackingWalletTable'
import { getProductClient } from '../components/InfoTables/config'

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const StyledCMCLink = styled(UIKitLink)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  & :hover {
    opacity: 0.8;
  }
`
const DEFAULT_TIME_WINDOW: Duration = { weeks: 1 }

const TokenPage: React.FC<React.PropsWithChildren<{ routeAddress: string }>> = ({ routeAddress }) => {
  const { isXs, isSm } = useMatchBreakpointsContext()
  const { t } = useTranslation()

  const appContext = useContext(RefreshCreateGlobal)
  const contextDelete = useContext(RefreshDeleteGlobal)

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const cmcLink = useCMCLink(address)

  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolDatas(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  // pricing data
  const priceData = useTokenPriceData(address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW)
  const adjustedPriceData = useMemo(() => {
    // Include latest available price
    if (priceData && tokenData && priceData.length > 0) {
      return [
        ...priceData,
        {
          time: new Date().getTime() / 1000,
          open: priceData[priceData.length - 1].close,
          close: tokenData?.priceUSD,
          high: tokenData?.priceUSD,
          low: priceData[priceData.length - 1].close,
        },
      ]
    }
    return undefined
  }, [priceData, tokenData])

  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()
  const [totalSupplyValue, setTotalSupplyValue] = useState({ totalSupply: 0 })
  useEffect(() => {
    const getSaleItems = async () => {
      try {
        const result = await fetchTotalSuppy()
        setTotalSupplyValue(result)
      } catch (e) {
        console.log(e)
      }
    }
    getSaleItems()
  }, [appContext.length, contextDelete.length])

  const [walletAddresses, setWalletAddresses] = useState([])
  const [walletInfo, setWalletInfo] = useState([])
  const [circulatingSupplyDisplay, setCirculatingSupplyDisplay] = useState({ circulatingSupply: 0 })

  useEffect(() => {
    getProductClient.get('').then((response) => {
      setWalletInfo(response.data.products)
      const addresses = response.data.products.map((wallet) => wallet.address)
      setWalletAddresses(addresses)
    })
  }, [appContext.length, contextDelete.length])

  useEffect(() => {
    const getCirculatingSupplyDisplay = async () => {
      try {
        if (walletAddresses.length > 0) {
          const result = await FetchCirculatingSupply(walletAddresses)
          setCirculatingSupplyDisplay(result)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getCirculatingSupplyDisplay()
    // }, [walletAddresses, appContext.length, contextDelete.length, circulatingSupplyDisplay])
  }, [walletAddresses, appContext.length, contextDelete.length])

  return (
    // <Provider store={store}>
    <Page symbol={tokenData?.symbol}>
      {tokenData ? (
        !tokenData.exists ? (
          <Card>
            <Box p="16px">
              <Text>
                {t('No pool has been created with this token yet. Create one')}
                <NextLinkFromReactRouter style={{ display: 'inline', marginLeft: '6px' }} to={`/add/${address}`}>
                  {t('here.')}
                </NextLinkFromReactRouter>
              </Text>
            </Box>
          </Card>
        ) : (
          <>
            {/* Stuff on top */}
            <Flex justifyContent="space-between" mb="24px" flexDirection={['column', 'column', 'row']}>
              <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
                <LinkExternal mr="8px" color="primary" href={getBscScanLink(address, 'address')}>
                  {t('View on BscScan')}
                </LinkExternal>
                {cmcLink && (
                  <StyledCMCLink href={cmcLink} rel="noopener noreferrer nofollow" target="_blank">
                    <Image src="/images/CMC-logo.svg" height={22} width={22} alt={t('View token on CoinMarketCap')} />
                  </StyledCMCLink>
                )}
                {/* <SaveIcon fill={watchlistTokens.includes(address)} onClick={() => addWatchlistToken(address)} /> */}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection="column" mb={['8px', null]}>
                <Flex alignItems="center">
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/19638.png" alt="Token Run" width="32" />
                  {/* <CurrencyLogo size="32px" address={address} /> */}
                  <Text
                    ml="12px"
                    bold
                    lineHeight="0.7"
                    fontSize={isXs || isSm ? '24px' : '40px'}
                    id="info-token-name-title"
                  >
                    {tokenData.name}
                  </Text>
                  <Text ml="12px" lineHeight="1" color="textSubtle" fontSize={isXs || isSm ? '14px' : '20px'}>
                    ({tokenData.symbol})
                  </Text>
                </Flex>
                <Flex mt="8px" ml="46px" alignItems="center">
                  <Text mr="16px" bold fontSize="24px">
                    ${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
                  </Text>
                  <Percent value={tokenData.priceUSDChange} fontWeight={600} />
                </Flex>
              </Flex>
            </Flex>
            <ContentLayout>
              <Card>
                <Box p="30px">
                  <Text bold small color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Liquidity')}
                  </Text>
                  <Text bold fontSize="15px">
                    ${formatAmount(tokenData.liquidityUSD)}
                  </Text>
                  <Percent value={tokenData.liquidityUSDChange} />

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Volume 24H')}
                  </Text>
                  <Text bold fontSize="15px" textTransform="uppercase">
                    ${formatAmount(tokenData.volumeUSD)}
                  </Text>
                  <Percent value={tokenData.volumeUSDChange} />

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Volume 7D')}
                  </Text>
                  <Text bold fontSize="15px">
                    ${formatAmount(tokenData.volumeUSDWeek)}
                  </Text>

                  {/* <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Transactions 24H')}
                  </Text>
                  <Text bold fontSize="15px">
                    {formatAmount(tokenData.txCount, { isInteger: true })}
                  </Text> */}

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('24H / Total transactions')}
                  </Text>
                  <Text bold fontSize="15px">
                    {formatAmount(tokenData.txCount, { isInteger: true })} /{' '}
                    {formatAmount(tokenData.txCountAll, { isInteger: true })}
                  </Text>

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Total Supply')}
                  </Text>
                  <Text bold fontSize="15px">
                    {formatAmount(totalSupplyValue.totalSupply, { isInteger: true })}
                  </Text>
                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Circulating Supply')}
                  </Text>
                  <Text bold fontSize="15px">
                    {formatAmount(Math.round(circulatingSupplyDisplay.circulatingSupply), { isInteger: true })}
                  </Text>
                </Box>
              </Card>
              {/* charts card */}
              <ChartCard
                variant="token"
                chartData={chartData}
                tokenData={tokenData}
                tokenPriceData={adjustedPriceData}
              />
            </ContentLayout>

            {/* pools and transaction tables */}

            <Heading scale="lg" mb="16px" mt="40px">
              {t('Team Wallets')}
            </Heading>

            <TeamWalletTable poolDatas={poolDatas} />

            <Heading scale="lg" mb="16px" mt="40px">
              {t('Tracking Wallets')}
            </Heading>

            <TrackingWalletTable poolDatas={poolDatas} />

            <Heading scale="lg" mb="16px" mt="40px">
              {t('Pools')}
            </Heading>

            <PoolTable poolDatas={poolDatas} />

            {/* <Heading scale="lg" mb="16px" mt="40px">
              {t('Transactions')}
            </Heading>

            <TransactionTable transactions={transactions} /> */}
          </>
        )
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
    // </Provider>
  )
}

export default TokenPage
