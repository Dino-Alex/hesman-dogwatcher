import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import erc20Abi from '../abis/ERC20abi.json'

const TEAMS = [
  '0x3bb2b2455356de1cd8c91030b1864210c5ddc7f1',
  '0x92d47b6e3dce6471f42021db650a611af4257771',
  '0xa3438081956b35d5c23203197360f7b082cc4c9d',
  '0xbc8aa54b5ccb8c6a306c07d8c70a9623970e160f',
]

export const FetchTokenBalance = async (): Promise<{ tokenBalanceVal: number[] }> => {
  try {
    const calls = []
    TEAMS.forEach((teams) => {
      calls.push({
        address: '0xc643e83587818202e0fff5ed96d10abbc8bb48e7',
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

export const fetchTotalSuppy = async (): Promise<{ totalSupply: number }> => {
  try {
    const calls = [
      {
        address: '0xc643e83587818202e0fff5ed96d10abbc8bb48e7',
        name: 'totalSupply',
        params: [],
      },
    ]
    const result = await multicall(erc20Abi, calls)
    const resultNumber = new BigNumber(result.toString()).toNumber() / 1e18
    return {
      totalSupply: resultNumber,
    }
  } catch (e) {
    console.log(e)
    return {
      totalSupply: 0,
    }
  }
}

export const FetchCirculatingSupply = async (): Promise<{ circulatingSupply: number }> => {
  try {
    const calls = []
    TEAMS.forEach((teams) => {
      calls.push({
        address: '0xc643e83587818202e0fff5ed96d10abbc8bb48e7',
        name: 'balanceOf',
        params: [teams],
      })
    })

    const result = await multicall(erc20Abi, calls)
    const balances = []
    result.forEach((balance) => {
      balances.push(Number(new BigNumber(balance).toJSON()) / 1e18)
    })

    let totalBalance = 0
    balances.forEach((balance) => {
      totalBalance += balance
    })

    const totalSupplyCalls = [
      {
        address: '0xc643e83587818202e0fff5ed96d10abbc8bb48e7',
        name: 'totalSupply',
        params: [],
      },
    ]
    const totalSupplyResult = await multicall(erc20Abi, totalSupplyCalls)
    const resultNumber = new BigNumber(totalSupplyResult.toString()).toNumber() / 1e18
    const circulatingSupplyValue = resultNumber - totalBalance
    return {
      circulatingSupply: circulatingSupplyValue,
    }
  } catch (e) {
    console.log(e)
    return {
      circulatingSupply: 0,
    }
  }
}
