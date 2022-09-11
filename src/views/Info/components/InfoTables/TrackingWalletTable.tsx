import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, Flex, Link, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { RefreshCreateGlobal } from 'components/Menu/GlobalSettings/SettingsModal'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PoolData } from 'state/info/types'
import styled from 'styled-components'
import { getBscScanLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import ModalTrackingCreate from 'views/Info/Tokens/Modal/ModalTrackingCreate'
import ModalTrackingDelete from 'views/Info/Tokens/Modal/ModalTrackingDelete'
import ModalTrackingUpdate from 'views/Info/Tokens/Modal/ModalTrackingUpdate'
import { FetchStakeBalance, FetchRewardBalance } from '../../hooks/useTokenBalance'
import { getTrackingClient } from './config'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 5fr 5fr 0fr 10fr;
  padding: 0 24px;
  position: relative;
`

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  lpFees24h: 'lpFees24h',
  lpApr7d: 'lpApr7d',
}

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </ResponsiveGrid>
)

const TableLoader: React.FC<React.PropsWithChildren> = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)
const Refresh = []

const DataRow = () => {
  const [walletInfo, setWalletInfo] = useState([])
  const [walletAddresses, setWalletAddresses] = useState([])
  const [stakeAddr, setStakeAddress] = useState([])
  const [rewardAddr, setRewardAddress] = useState([])
  const [stakeBalances, setStakeBalances] = useState({ tokenBalanceVal: [0] })
  const [rewardBalances, setRewardBalances] = useState({ tokenBalanceVal: [0] })
  const tokenAuth = localStorage.getItem('token')

  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    const getSaleItems = async () => {
      try {
        if (walletAddresses.length > 0) {
          const resultStake = await FetchStakeBalance(walletAddresses, stakeAddr)
          setStakeBalances(resultStake)
          const resultReward = await FetchRewardBalance(walletAddresses, rewardAddr)
          setRewardBalances(resultReward)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getSaleItems()
  }, [walletAddresses])

  function sAccount(dataAddress: string) {
    if (dataAddress) {
      return `${dataAddress.substring(0, 8)}...${dataAddress.substring(dataAddress.length - 8)}`
    }
    return ''
  }
  const appContext = useContext(RefreshCreateGlobal)

  useEffect(() => {
    getTrackingClient.get('').then((response) => {
      setWalletInfo(response.data.trackings)
      const addresses = response.data.trackings.map((wallet) => wallet.address)
      const stakeToken = response.data.trackings.map((wallet) => wallet.stakeToken)
      const rewardToken = response.data.trackings.map((wallet) => wallet.rewardToken)
      setWalletAddresses(addresses)
      setStakeAddress(stakeToken)
      setRewardAddress(rewardToken)
    })
  }, [Refresh.length, appContext.length])

  const [idDelete, setIdDelete] = useState(0)
  const [idUpdate, setUpdate] = useState(0)

  const [handleClickDel] = useModal(
    <ModalTrackingDelete ID={idDelete} onRefresh={(newValue) => Refresh.push(newValue)} />,
  )

  const [handleClickUpdate] = useModal(
    <ModalTrackingUpdate id={idUpdate} onRefresh={(newValue) => Refresh.push(newValue)} />,
  )

  return (
    <>
      {walletInfo.map((data, index) => {
        return (
          <ResponsiveGrid>
            {tokenAuth ? (
              <>
                <FlexID>
                  <Text>{index + 1}</Text>
                </FlexID>
                <FlexName>
                  <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                    {data.name}
                  </Link>
                </FlexName>
                <input type="hidden" value={data._id} />
                <FlexAddress>
                  <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                    {sAccount(data.address)}
                  </Link>
                </FlexAddress>
                <FlexPriceToken>
                  <FlexBalance>
                    {formatAmount(Math.round(stakeBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexBalance>
                  <FlexReward>
                    {formatAmount(Math.round(rewardBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexReward>
                </FlexPriceToken>
              </>
            ) : (
              <>
                <FlexIDV2>
                  <Text>{index + 1}</Text>
                </FlexIDV2>
                <FlexNameV2>
                  <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                    {data.name}
                  </Link>
                </FlexNameV2>
                <input type="hidden" value={data._id} />
                <FlexAddressV2>
                  <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                    {sAccount(data.address)}
                  </Link>
                </FlexAddressV2>
                <FlexPriceTokenV2>
                  <FlexBalanceV2>
                    {formatAmount(Math.round(stakeBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexBalanceV2>
                  <FlexRewardV2>
                    {formatAmount(Math.round(rewardBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexRewardV2>
                </FlexPriceTokenV2>
              </>
            )}
            {tokenAuth !== null ? (
              <>
                <FlexAction>
                  <Flex justifyContent="center" alignItems="center">
                    <Tooltip
                      placement="top"
                      title="Update"
                      onClick={handleClickUpdate}
                      onClickCapture={() => setUpdate(data._id)}
                    >
                      <IconButton color="primary" aria-label="delete" size="large">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      placement="top"
                      title="Delete"
                      onClick={handleClickDel}
                      onClickCapture={() => setIdDelete(data._id)}
                      sx={{
                        marginLeft: '-1rem',
                      }}
                    >
                      <IconButton color="primary" size="large">
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </FlexAction>
              </>
            ) : (
              <></>
            )}
          </ResponsiveGrid>
        )
      })}
    </>
  )
}

interface PoolTableProps {
  poolDatas: PoolData[]
  loading?: boolean // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const TrackingWalletTable: React.FC<React.PropsWithChildren<PoolTableProps>> = ({ poolDatas, loading }) => {
  const router = useRouter()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const { t } = useTranslation()

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
  }, [poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [page, poolDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  // Open Modal Create

  const [refresh, setRefresh] = useState(0)
  const [handleClickCreate] = useModal(<ModalTrackingCreate onRefresh={(newValue) => Refresh.push(newValue)} />)

  const tokenAuth = localStorage.getItem('token')

  return (
    <TableWrapper>
      <ResponsiveGrid>
        {tokenAuth ? (
          <>
            <FlexID>
              <Text color="secondary" fontSize="12px" bold>
                #
              </Text>
            </FlexID>
            <FlexName>
              <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
                {t('Name')}
              </Text>
            </FlexName>
            <FlexAddress>
              <ClickableColumnHeader
                color="secondary"
                fontSize="12px"
                bold
                onClick={() => handleSort(SORT_FIELD.volumeUSD)}
                textTransform="uppercase"
              >
                {t('Pool Address')} {arrow(SORT_FIELD.volumeUSD)}
              </ClickableColumnHeader>
            </FlexAddress>
            <FlexPriceToken>
              <FlexBalance>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  bold
                  onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                  textTransform="uppercase"
                >
                  {t('HES')} {arrow(SORT_FIELD.volumeUSDWeek)}
                </ClickableColumnHeader>
              </FlexBalance>
              <FlexReward>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  bold
                  onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                  textTransform="uppercase"
                >
                  {t('BUSD')} {arrow(SORT_FIELD.volumeUSDWeek)}
                </ClickableColumnHeader>
              </FlexReward>
            </FlexPriceToken>
            <FlexActionTitle>
              <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase">
                {t('Action')}
              </ClickableColumnHeader>
            </FlexActionTitle>
          </>
        ) : (
          <>
            <FlexIDV2>
              <Text color="secondary" fontSize="12px" bold>
                #
              </Text>
            </FlexIDV2>
            <FlexNameV2>
              <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
                {t('Name')}
              </Text>
            </FlexNameV2>
            <FlexAddressV2>
              <ClickableColumnHeader
                color="secondary"
                fontSize="12px"
                bold
                onClick={() => handleSort(SORT_FIELD.volumeUSD)}
                textTransform="uppercase"
              >
                {t('Pool Address')} {arrow(SORT_FIELD.volumeUSD)}
              </ClickableColumnHeader>
            </FlexAddressV2>
            <FlexPriceTokenV2>
              <FlexBalanceV2>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  bold
                  onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                  textTransform="uppercase"
                >
                  {t('HES')} {arrow(SORT_FIELD.volumeUSDWeek)}
                </ClickableColumnHeader>
              </FlexBalanceV2>
              <FlexRewardV2>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  bold
                  onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                  textTransform="uppercase"
                >
                  {t('BUSD')} {arrow(SORT_FIELD.volumeUSDWeek)}
                </ClickableColumnHeader>
              </FlexRewardV2>
            </FlexPriceTokenV2>
            <FlexActionV2>
              <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase">
                {t('Action')}
              </ClickableColumnHeader>
            </FlexActionV2>
          </>
        )}
      </ResponsiveGrid>

      <Break />
      {sortedPools.length > 0 ? (
        <>
          {sortedPools.map((poolData) => {
            if (poolData) {
              return (
                <Fragment key={poolData.address}>
                  <DataRow />
                  <Break />
                </Fragment>
              )
            }
            return null
          })}
          {loading && <LoadingRow />}
          <PageButtons>
            <Arrow
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>

            <Arrow
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      ) : (
        <>
          <TableLoader />
          {/* spacer */}
          <Box />
        </>
      )}
    </TableWrapper>
  )
}

export default TrackingWalletTable

const FlexName = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 350px;
  }
  @media screen and (max-width: 2560px) {
    width: 350px;
  }
  @media screen and (max-width: 1440px) {
    width: 350px;
  }
  @media screen and (max-width: 1024px) {
    width: 250px;
  }
  @media screen and (max-width: 900px) {
    width: 230px;
  }
  @media screen and (max-width: 600px) {
    width: 220px;
  }
  @media screen and (max-width: 400px) {
    width: 130px;
  }
  @media screen and (max-width: 340px) {
    width: 70px;
  }
  @media screen and (max-width: 319px) {
    display: none;
  }
`
const FlexBalance = styled(Flex)`
  width: 100%;
`
const FlexReward = styled(Flex)`
  width: 100%;
`
const FlexID = styled(Flex)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`
const FlexAddress = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 350px;
    margin-left: 5rem;
  }
  @media screen and (max-width: 2560px) {
    width: 350px;
    margin-left: 3rem;
  }
  @media screen and (max-width: 1440px) {
    width: 350px;
    margin-left: 2rem;
  }
  @media screen and (max-width: 1024px) {
    width: 220px;
  }
  @media screen and (max-width: 900px) {
    width: 230px;
    margin-left: 0rem;
  }
  @media screen and (max-width: 800px) {
    width: 230px;
    margin-left: -2rem;
  }
  @media screen and (max-width: 700px) {
    display: none;
  }
`
const FlexPriceToken = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 200px;
    gap: 50px;
    position: absolute;
    right: 180px;
  }
  @media screen and (max-width: 2560px) {
    width: 200px;
    gap: 50px;
    position: absolute;
    right: 180px;
  }
  @media screen and (max-width: 1440px) {
    width: 180px;
    position: absolute;
    right: 160px;
  }
  @media screen and (max-width: 1024px) {
    width: 160px;
    position: absolute;
    right: 140px;
  }
  @media screen and (max-width: 900px) {
    width: 160px;
    position: absolute;
    right: 50px;
  }
  @media screen and (max-width: 600px) {
    width: 140px;
    position: absolute;
    right: 20px;
  }
  @media screen and (max-width: 319px) {
    display: none;
  }
`
const FlexAction = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 70px;
    position: absolute;
    right: 80px;
  }
  @media screen and (max-width: 2560px) {
    width: 70px;
    position: absolute;
    right: 80px;
  }
  @media screen and (max-width: 1440px) {
    width: 70px;
    position: absolute;
    right: 70px;
  }
  @media screen and (max-width: 1024px) {
    width: 70px;
    position: absolute;
    right: 50px;
  }
  @media screen and (max-width: 900px) {
    display: none;
  }
`
const FlexActionTitle = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 70px;
    position: absolute;
    right: 70px;
  }
  @media screen and (max-width: 2560px) {
    width: 70px;
    position: absolute;
    right: 70px;
  }
  @media screen and (max-width: 1440px) {
    width: 70px;
    position: absolute;
    right: 60px;
  }
  @media screen and (max-width: 1024px) {
    width: 70px;
    position: absolute;
    right: 40px;
  }
  @media screen and (max-width: 900px) {
    display: none;
  }
`
// No login
const FlexIDV2 = styled(Flex)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`
const FlexNameV2 = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 350px;
  }
  @media screen and (max-width: 2560px) {
    width: 350px;
  }
  @media screen and (max-width: 1440px) {
    width: 350px;
  }
  @media screen and (max-width: 1024px) {
    width: 250px;
  }
  @media screen and (max-width: 900px) {
    width: 230px;
  }
  @media screen and (max-width: 600px) {
    width: 220px;
  }
  @media screen and (max-width: 400px) {
    width: 130px;
  }
  @media screen and (max-width: 340px) {
    width: 70px;
  }
  @media screen and (max-width: 319px) {
    display: none;
  }
`
const FlexAddressV2 = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 350px;
    margin-left: 5rem;
  }
  @media screen and (max-width: 2560px) {
    width: 350px;
    margin-left: 5rem;
  }
  @media screen and (max-width: 1440px) {
    width: 350px;
    margin-left: 2rem;
  }
  @media screen and (max-width: 1024px) {
    width: 250px;
    margin-left: 2rem;
  }
  @media screen and (max-width: 900px) {
    width: 230px;
    margin-left: 0rem;
  }
  @media screen and (max-width: 800px) {
    width: 230px;
    margin-left: -2rem;
  }
  @media screen and (max-width: 700px) {
    display: none;
  }
`
const FlexBalanceV2 = styled(Flex)`
  width: 100%;
`
const FlexRewardV2 = styled(Flex)`
  width: 100%;
`
const FlexPriceTokenV2 = styled(Flex)`
  @media screen and (min-width: 2560px) {
    width: 200px;
    gap: 50px;
    position: absolute;
    right: 70px;
  }
  @media screen and (max-width: 2560px) {
    width: 200px;
    gap: 50px;
    position: absolute;
    right: 70px;
  }
  @media screen and (max-width: 1440px) {
    width: 180px;
    gap: 40px;
    position: absolute;
    right: 60px;
  }
  @media screen and (max-width: 1024px) {
    width: 160px;
    gap: 30px;
    position: absolute;
    right: 40px;
  }
  @media screen and (max-width: 900px) {
    width: 160px;
    gap: 30px;
    position: absolute;
    right: 40px;
  }
  @media screen and (max-width: 600px) {
    width: 140px;
    position: absolute;
    right: 20px;
  }
  @media screen and (max-width: 319px) {
    display: none;
  }
`

const FlexActionV2 = styled(Flex)`
  display: none;
  @media screen and (max-width: 600px) {
  }
`
