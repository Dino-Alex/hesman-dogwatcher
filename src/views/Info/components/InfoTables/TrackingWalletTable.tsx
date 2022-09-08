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
                <FlexID width="4vw">
                  <Text>{index + 1}</Text>
                </FlexID>
                <FlexName width="20vw">
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
                <Flex>
                  <FlexBalance width="10vw">
                    {formatAmount(Math.round(stakeBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexBalance>
                  <FlexReward width="10vw">
                    {formatAmount(Math.round(rewardBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexReward>
                </Flex>
              </>
            ) : (
              <>
                <FlexIDV2 width="4vw">
                  <Text>{index + 1}</Text>
                </FlexIDV2>
                <FlexNameV2 width="25vw">
                  <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                    {data.name}
                  </Link>
                </FlexNameV2>
                <input type="hidden" value={data._id} />
                <FlexAddressV2 width="20vw">
                  <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                    {sAccount(data.address)}
                  </Link>
                </FlexAddressV2>
                <Flex>
                  <FlexBalanceV2 width="12vw">
                    {formatAmount(Math.round(stakeBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexBalanceV2>
                  <FlexRewardV2 width="12vw">
                    {formatAmount(Math.round(rewardBalances.tokenBalanceVal[index]), { isInteger: true })}
                  </FlexRewardV2>
                </Flex>
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
            <Flex>
              <FlexBalance>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  bold
                  onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                  textTransform="uppercase"
                >
                  {t('RUN')} {arrow(SORT_FIELD.volumeUSDWeek)}
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
            </Flex>
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
            <Flex>
              <FlexBalanceV2>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  bold
                  onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                  textTransform="uppercase"
                >
                  {t('RUN')} {arrow(SORT_FIELD.volumeUSDWeek)}
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
            </Flex>
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
  @media screen and (max-width: 420px) {
    width: 25vw;
  }
  @media screen and (min-width: 421px) and (max-width: 600px) {
    width: 35vw;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 150px;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 22vw;
  }
  @media screen and (min-width: 1440px) {
    width: 400px;
    margin-left: 0vw;
  }
`
const FlexBalance = styled(Flex)`
  @media screen and (max-width: 420px) {
    width: 23vw;
    margin-left: 20vw;
  }
  @media screen and (min-width: 421px) and (max-width: 600px) {
    width: 25vw;
    margin-left: 25vw;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 100px;
    margin-left: 5vw;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 15vw;
    margin-left: 1vw;
  }
  @media screen and (min-width: 1440px) {
    width: 150px;
    margin-left: 0vw;
  }
`
const FlexReward = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 25vw;
    margin-left: 2vw;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 100px;
    margin-left: 5vw;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 15vw;
    margin-left: 1vw;
  }
  @media screen and (min-width: 1440px) {
    width: 150px;
    margin-left: 0vw;
  }
`
const FlexID = styled(Flex)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`
const FlexAddress = styled(Flex)`
  @media screen and (max-width: 600px) {
    display: none;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 150px;
    margin-left: 5vw;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 22vw;
    margin-left: 1vw;
  }
  @media screen and (min-width: 1440px) {
    width: 250px;
    margin-left: 0vw;
  }
`
const FlexAction = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 10vw;
    margin-left: -5vw;
    display: none;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 70px;
    margin-left: 0vw;
    display: none;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 20vw;
    margin-left: 0vw;
  }
  @media screen and (min-width: 1440px) {
    width: 70px;
    margin-left: -2vw;
  }
`

const FlexActionTitle = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 17vw;
    margin-left: 0vw;
    display: none;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 60px;
    margin-left: 2vw;
    display: none;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 20vw;
    margin-left: -3vw;
  }
  @media screen and (min-width: 1440px) {
    width: 70px;
    margin-left: -1vw;
  }
`
// No login
const FlexNameV2 = styled(Flex)`
  width: 34vw;
  @media screen and (max-width: 600px) {
    width: 55vw;
  }
  @media screen and (min-width: 1440px) {
    width: 400px;
    margin-left: 0vw;
  }
`
const FlexBalanceV2 = styled(Flex)`
  width: 20vw;
  margin-left: 13vw;
  @media screen and (max-width: 600px) {
    width: 20vw;
    margin-left: 20vw;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 15vw;
    margin-left: 5vw;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 10vw;
    margin-left: 10vw;
  }
  @media screen and (min-width: 1025px) and (max-width: 1444px) {
    width: 10vw;
    margin-left: 3vw;
  }
  @media screen and (min-width: 1440px) {
    width: 150px;
    margin-left: 0vw;
  }
`
const FlexRewardV2 = styled(Flex)`
  width: 20vw;
  margin-left: 13vw;
  @media screen and (max-width: 600px) {
    width: 20vw;
    margin-left: 10vw;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 15vw;
    margin-left: 5vw;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 10vw;
    margin-left: 10vw;
  }
  @media screen and (min-width: 1025px) and (max-width: 1444px) {
    width: 7vw;
    margin-left: 2vw;
  }
  @media screen and (min-width: 1440px) {
    width: 100px;
    margin-left: 1vw;
  }
`
const FlexIDV2 = styled(Flex)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`
const FlexAddressV2 = styled(Flex)`
  @media screen and (max-width: 600px) {
    display: none;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 20vw;
    margin-left: -15vw;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 20vw;
    margin-left: -10vw;
  }
  @media screen and (min-width: 1440px) {
    width: 350px;
    margin-left: 0vw;
  }
`
const FlexActionV2 = styled(Flex)`
  display: none;
  @media screen and (max-width: 600px) {
  }
`
