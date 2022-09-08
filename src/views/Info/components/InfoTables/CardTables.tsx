import { Flex, Link, Text } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getBscScanLink } from 'utils'
import { FetchTokenBalance } from 'views/Info/hooks/useTotalSupply'
import { getProductClient } from './config'

const CardTable = (data: any, index: any) => {
  console.log('data', data)

  const { chainId } = useActiveWeb3React()
  const [tokenBalances, setTokenBalances] = useState({ tokenBalanceVal: [0] })

  return (
    <ResponsiveGrid>
      <Text>{data.index + 1}</Text>
      <Flex>
        <Link href={getBscScanLink(data.data.address, 'address', chainId)} external>
          {data.data.name}
        </Link>
      </Flex>
      <input type="hidden" value={data.data._id} />
      <Flex>
        <Text ml="8px">
          {/* {data.data.address} */}
          {`${data.data.address.substring(0, 4)}...${data.data.address.substring(38, 42)}`}
        </Text>
      </Flex>
      <Flex>
        <Text>{new Intl.NumberFormat().format(tokenBalances.tokenBalanceVal[data.index])}</Text>
      </Flex>
    </ResponsiveGrid>
  )
}

export default CardTable

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
