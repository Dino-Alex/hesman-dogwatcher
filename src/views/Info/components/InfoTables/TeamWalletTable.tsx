import React, { useCallback, useState, useMemo, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Backdrop, Box, Fade, Grid, IconButton, Modal, Stack, Tooltip, Typography } from '@mui/material'
import ModalCreate from 'views/Info/Tokens/Modal/ModalCreate'
import ModalUpdate from 'views/Info/Tokens/Modal/ModalUpdate'
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { FcDataBackup, FcDeleteDatabase } from 'react-icons/fc'
import { ArrowBackIcon, ArrowForwardIcon, Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { formatAmount } from 'utils/formatInfoNumbers'
import { PoolData } from 'state/info/types'
import { useRouter } from 'next/router'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { useTranslation } from '@pancakeswap/localization'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'
import { getProductClient, deleteProductClient, updateProductClient } from './config'
import datas from './data.json'
import { FetchTokenBalance, fetchTotalSuppy } from '../../hooks/useTotalSupply'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  }
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
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

const DataRow = () => {
  const [walletInfo, setWalletInfo] = useState([])
  const [walletAddresses, setWalletAddresses] = useState([])
  const [tokenBalances, setTokenBalances] = useState({ tokenBalanceVal: [0] })
  const tokenAuth = localStorage.getItem('token')
  useEffect(() => {
    const getSaleItems = async () => {
      try {
        if (walletAddresses.length > 0) {
          const result = await FetchTokenBalance(walletAddresses)
          console.log(result)
          setTokenBalances(result)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getSaleItems()
  }, [walletAddresses])
  console.log('tokenBalances', tokenBalances.tokenBalanceVal[1])

  function sAccount(dataAddress: string) {
    if (dataAddress) {
      return `${dataAddress.substring(0, 4)}...${dataAddress.substring(dataAddress.length - 4)}`
    }
    return ''
  }

  // OpenModal
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)
  const [ID, setID] = useState(0)
  const [posts, setPosts] = useState([])

  function handleClickUpdate(id, e) {
    setOpen(true)
    setID(id)
  }
  const deletePost = async (id, e) => {
    await axios.delete(`https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/admin/product/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        token: `${tokenAuth}`,
      },
    })
    setPosts(
      posts.filter((post) => {
        return post.id !== id
      }),
    )
  }

  const style = {
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  useEffect(() => {
    getProductClient.get('').then((response) => {
      setWalletInfo(response.data.products)
      const addresses = response.data.products.map((wallet) => wallet.address)
      setWalletAddresses(addresses)
    })
  }, [posts, ID])

  return (
    <>
      {walletInfo.map((data, index) => {
        return (
          <ResponsiveGrid>
            <Text>{index + 1}</Text>
            <Flex>
              <Text ml="8px">{data.name}</Text>
            </Flex>
            <Flex>
              <Text ml="8px">{sAccount(data.address)}</Text>
            </Flex>
            <Flex>
              <Text>{Math.round(tokenBalances.tokenBalanceVal[index])}</Text>
            </Flex>
            {tokenAuth !== null ? (
              <>
                <Flex>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Tooltip placement="top" title="Update" onClick={(e) => handleClickUpdate(data._id, e)}>
                      <IconButton color="primary" aria-label="delete" size="large">
                        {/* <EditOffIcon sx={{ fontSize: '2rem' }}
                  /> */}
                        <FcDataBackup />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete" onClick={(e) => deletePost(data._id, e)}>
                      <IconButton color="primary" size="large">
                        {/* <DeleteIcon sx={{ fontSize: '2rem' }} /> */}
                        <FcDeleteDatabase />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Flex>
              </>
            ) : (
              <></>
            )}

            <Grid>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={open}>
                  <CustomBox sx={style}>
                    <Typography id="transition-modal-title" variant="h2" component="h2">
                      Update TEAM
                    </Typography>
                    <ModalUpdate id={ID} />
                  </CustomBox>
                </Fade>
              </Modal>
            </Grid>
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
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)

  function handleClickCreate() {
    setOpen(true)
  }

  const [isLogOut, setLogOut] = useState(true)

  async function handleClickLogOut() {
    const tokenAuth = localStorage.getItem('token')
    await axios.get('https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/products', {
      headers: {
        'Content-Type': 'application/json',
        token: `${tokenAuth}`,
      },
    })
    localStorage.removeItem('token')
    setLogOut(false)
  }

  const router = useRouter()
  function handleClickLogIn() {
    router.push('/login')
  }

  const style = {
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const tokenAuth = localStorage.getItem('token')

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Name')}
        </Text>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          {t('Address')} {arrow(SORT_FIELD.volumeUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
          textTransform="uppercase"
        >
          {t('Balance')} {arrow(SORT_FIELD.volumeUSDWeek)}
        </ClickableColumnHeader>
        <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Action')}
        </ClickableColumnHeader>
        {tokenAuth !== null && isLogOut ? (
          <>
            <Button onClick={() => handleClickCreate()}>{t('Create')}</Button>
            <Button onClick={() => handleClickLogOut()}>{t('LOGOUT')}</Button>
          </>
        ) : (
          <>
            <Button onClick={() => handleClickLogIn()}>{t('LOGIN')}</Button>
          </>
        )}
      </ResponsiveGrid>
      <Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <CustomBox sx={style}>
              <Typography id="transition-modal-title" variant="h2" component="h2">
                Create TEAM
              </Typography>
              <ModalCreate onRefresh={(newValue) => setOpen(newValue)} />
            </CustomBox>
          </Fade>
        </Modal>
      </Grid>
      <Break />
      {sortedPools.length > 0 ? (
        <>
          {sortedPools.map((poolData, i) => {
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
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 95%;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 95%;
  }
`
