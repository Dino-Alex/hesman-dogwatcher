import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { getTrackingByAddress } from 'views/Info/components/InfoTables/config'
import { useState, useEffect } from 'react'
import erc20Abi from '../abis/ERC20abi.json'

export const FetchTokenBalance = async (addresses: string[]): Promise<{ tokenBalanceVal: number[] }> => {
  try {
    const calls = []
    addresses.forEach((teams) => {
      calls.push({
        address: '0x80A466Cea081bDd8E9c3Be80268Aad16915D03D0',
        name: 'balanceOf',
        params: [teams],
      })
    })

    const result = await multicall(erc20Abi, calls)
    const balances = []
    result.forEach((balance) => {
      balances.push(Number(new BigNumber(balance).toJSON()) / 1e18)
    })
    return {
      tokenBalanceVal: balances,
    }
  } catch (e) {
    console.log(e)
    return {
      tokenBalanceVal: [],
    }
  }
}

export const FetchStakeBalance = async (
  addresses: string[],
  token: string[],
): Promise<{ tokenBalanceVal: number[] }> => {
  try {
    const calls = []
    for (let i = 0; i < addresses.length; i++) {
      calls.push({
        address: token[i],
        name: 'balanceOf',
        params: [addresses[i]],
      })
    }

    const result = await multicall(erc20Abi, calls)
    const balances = []
    result.forEach((balance) => {
      balances.push(Number(new BigNumber(balance).toJSON()) / 1e18)
    })
    return {
      tokenBalanceVal: balances,
    }
  } catch (e) {
    console.log(e)
    return {
      tokenBalanceVal: [],
    }
  }
}

export const FetchRewardBalance = async (
  addresses: string[],
  token: string[],
): Promise<{ tokenBalanceVal: number[] }> => {
  try {
    const calls = []
    for (let i = 0; i < addresses.length; i++) {
      calls.push({
        address: token[i],
        name: 'balanceOf',
        params: [addresses[i]],
      })
    }

    const result = await multicall(erc20Abi, calls)
    const balances = []
    result.forEach((balance) => {
      balances.push(Number(new BigNumber(balance).toJSON()) / 1e18)
    })
    return {
      tokenBalanceVal: balances,
    }
  } catch (e) {
    console.log(e)
    return {
      tokenBalanceVal: [],
    }
  }
}
