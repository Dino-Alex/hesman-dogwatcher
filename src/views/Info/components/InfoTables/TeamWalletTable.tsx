import React, { useCallback, useState, useMemo, useContext, useEffect, Fragment } from 'react'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import ModalCreate from 'views/Info/Tokens/Modal/ModalCreate'
import ModalUpdate from 'views/Info/Tokens/Modal/ModalUpdate'
import styled from 'styled-components'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import { ArrowBackIcon, ArrowForwardIcon, Flex, Skeleton, Text, useModal, Link } from '@pancakeswap/uikit'
import { PoolData } from 'state/info/types'
import { useRouter } from 'next/router'
import { RefreshCreateGlobal } from 'components/Menu/GlobalSettings/SettingsModal'
import useTheme from 'hooks/useTheme'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { useTranslation } from '@pancakeswap/localization'
import ModalDelete from 'views/Info/Tokens/Modal/ModalDelete'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'
import { getProductClient } from './config'
import { FetchTokenBalance } from '../../hooks/useTotalSupply'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 5fr 5fr 0fr 10fr;
  padding: 0 24px;
  /* @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(3),
    & :nth-child(4),

    & :nth-child(7)
    {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  } */
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
  const { isDark } = useTheme()
  const [walletAddresses, setWalletAddresses] = useState([])
  const [tokenBalances, setTokenBalances] = useState({ tokenBalanceVal: [0] })
  const tokenAuth = localStorage.getItem('token')

  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    const getSaleItems = async () => {
      try {
        if (walletAddresses.length > 0) {
          const result = await FetchTokenBalance(walletAddresses)
          setTokenBalances(result)
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
    getProductClient.get('').then((response) => {
      setWalletInfo(response.data.products)
      const addresses = response.data.products.map((wallet) => wallet.address)
      setWalletAddresses(addresses)
    })
  }, [Refresh.length, appContext.length])

  const [idDelete, setIdDelete] = useState(0)
  const [idUpdate, setUpdate] = useState(0)

  const [handleClickDel] = useModal(<ModalDelete ID={idDelete} onRefresh={(newValue) => Refresh.push(newValue)} />)

  const [handleClickUpdate] = useModal(<ModalUpdate id={idUpdate} onRefresh={(newValue) => Refresh.push(newValue)} />)

  return (
    <>
      {walletInfo.map((data, index) => {
        return (
          <ResponsiveGrid>
            <FlexID width="4vw">
              <Text>{index + 1}</Text>
            </FlexID>
            <FlexName width="15vw">
              <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                {data.name}
              </Link>
            </FlexName>
            <input type="hidden" value={data._id} />
            <FlexAddress width="20vw" justifyContent="center">
              <Link href={getBscScanLink(data.address, 'address', chainId)} external>
                {sAccount(data.address)}
              </Link>
            </FlexAddress>
            <FlexBalance width="12vw" justifyContent="flex-end">
              <Text>{new Intl.NumberFormat().format(tokenBalances.tokenBalanceVal[index])}</Text>
            </FlexBalance>
            {tokenAuth !== null ? (
              <>
                <FlexAction justifyContent="center">
                  <Stack direction="row" justifyContent="center" alignItems="center">
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
                    >
                      <IconButton color="primary" size="large">
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
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

const TeamWalletTable: React.FC<React.PropsWithChildren<PoolTableProps>> = ({ poolDatas, loading }) => {
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
  const [handleClickCreate] = useModal(<ModalCreate onRefresh={(newValue) => Refresh.push(newValue)} />)

  const tokenAuth = localStorage.getItem('token')

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <FlexID width="4vw">
          <Text color="secondary" fontSize="12px" bold>
            #
          </Text>
        </FlexID>
        <FlexName width="12vw" justifyContent="center">
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Name')}
          </Text>
        </FlexName>
        <FlexAddress width="23vw" justifyContent="center">
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.volumeUSD)}
            textTransform="uppercase"
          >
            {t('Address')} {arrow(SORT_FIELD.volumeUSD)}
          </ClickableColumnHeader>
        </FlexAddress>
        <FlexBalance width="18vw" justifyContent="center">
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
            textTransform="uppercase"
          >
            {t('Balance')} {arrow(SORT_FIELD.volumeUSDWeek)}
          </ClickableColumnHeader>
        </FlexBalance>
        <FlexAction width="12vw" justifyContent="center">
          <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Action')}
          </ClickableColumnHeader>
        </FlexAction>
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

export default TeamWalletTable

const CustomBox = styled(Box)`
  @media screen and (max-width: 600px) {
    width: 95%;
  }
`
const FlexName = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 20vw;
  }
`
const FlexBalance = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 20vw;
    margin: 15vw;
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
`
const FlexAction = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 20vw;
    margin: -15vw;
  }
`
