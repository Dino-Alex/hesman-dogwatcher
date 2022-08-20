import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import erc20Abi from '../abis/ERC20abi.json'

export const FetchTokenBalance = async (addresses: string[]): Promise<{ tokenBalanceVal: number[] }> => {
  try {
    const calls = []
    addresses.forEach((teams) => {
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

export const FetchCirculatingSupply = async (addresses: string[]): Promise<{ circulatingSupply: number }> => {
  try {
    const calls = []
    addresses.forEach((teams) => {
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
