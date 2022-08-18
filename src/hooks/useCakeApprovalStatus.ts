import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useCake } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import { Contract } from '@ethersproject/contracts'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useCakeApprovalStatus = (spender) => {
  const { account } = useWeb3React()
  const { reader: cakeContract } = useCake()
  let swrKey: UseSWRContractKey<Contract, any>

  const key = useMemo<UseSWRContractKey>(() => (account && spender ? swrKey : swrKey), [account, cakeContract, spender])

  const { data, mutate } = useSWRContract(key)

  return { isVaultApproved: data ? data.gt(0) : false, setLastUpdated: mutate }
}

export default useCakeApprovalStatus
