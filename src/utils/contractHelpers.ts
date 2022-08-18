import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { bscRpcProvider } from 'utils/providers'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import { CAKE } from 'config/constants/tokens'

// Addresses
import {
  getAddress,
  getPancakeProfileAddress,
  getPancakeBunniesAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getLotteryV2Address,
  getMasterChefAddress,
  getMasterChefV1Address,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddressEaster,
  getEasterNftAddress,
  getCakeVaultAddress,
  getMulticallAddress,
  getBunnySpecialCakeVaultAddress,
  getBunnySpecialPredictionAddress,
  getBunnySpecialLotteryAddress,
  getFarmAuctionAddress,
  getAnniversaryAchievement,
  getNftMarketAddress,
  getNftSaleAddress,
  getPancakeSquadAddress,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMobox,
  getTradingCompetitionAddressMoD,
  getBunnySpecialXmasAddress,
  getICakeAddress,
  getPotteryDrawAddress,
  getZapAddress,
  getCakeFlexibleSideVaultAddress,
  getPredictionsV1Address,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeBunniesAbi from 'config/abi/pancakeBunnies.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV1 from 'config/abi/masterchefV1.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tradingCompetitionEasterAbi from 'config/abi/tradingCompetitionEaster.json'
import tradingCompetitionFanTokenAbi from 'config/abi/tradingCompetitionFanToken.json'
import tradingCompetitionMoboxAbi from 'config/abi/tradingCompetitionMobox.json'
import tradingCompetitionMoDAbi from 'config/abi/tradingCompetitionMoD.json'
import easterNftAbi from 'config/abi/easterNft.json'
import cakeVaultV2Abi from 'config/abi/cakeVaultV2.json'
import cakeFlexibleSideVaultV2Abi from 'config/abi/cakeFlexibleSideVaultV2.json'
import predictionsAbi from 'config/abi/predictions.json'
import predictionsV1Abi from 'config/abi/predictionsV1.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import bunnySpecialCakeVaultAbi from 'config/abi/bunnySpecialCakeVault.json'
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import bunnySpecialXmasAbi from 'config/abi/bunnySpecialXmas.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import pancakeSquadAbi from 'config/abi/pancakeSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import zapAbi from 'config/abi/zap.json'
import iCakeAbi from 'config/abi/iCake.json'
import ifoV3Abi from 'config/abi/ifoV3.json'
import cakePredictionsAbi from 'config/abi/cakePredictions.json'

// Types
import type {
  ChainlinkOracle,
  FarmAuction,
  Predictions,
  AnniversaryAchievement,
  IfoV1,
  IfoV2,
  Erc20,
  Erc721,
  Cake,
  BunnyFactory,
  PancakeBunnies,
  PancakeProfile,
  LotteryV2,
  Masterchef,
  MasterchefV1,
  SousChef,
  SousChefV2,
  BunnySpecial,
  LpToken,
  ClaimRefund,
  TradingCompetitionEaster,
  TradingCompetitionFanToken,
  EasterNft,
  Multicall,
  BunnySpecialCakeVault,
  BunnySpecialPrediction,
  BunnySpecialLottery,
  NftMarket,
  NftSale,
  PancakeSquad,
  Erc721collection,
  PointCenterIfo,
  CakeVaultV2,
  CakeFlexibleSideVaultV2,
  TradingCompetitionMobox,
  ICake,
  TradingCompetitionMoD,
  PotteryVaultAbi,
  PotteryDrawAbi,
  Zap,
  PredictionsV1,
} from 'config/abi/types'
import { ChainId } from '@pancakeswap/sdk'

export const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? bscRpcProvider
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(bep20Abi, address, signer) as unknown as Erc20
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(erc721Abi, address, signer) as unknown as Erc721
}
export const getLpContract = (address: string, signer?: Signer | Provider) => {
  return getContract(lpTokenAbi, address, signer) as unknown as LpToken
}
export const getIfoV1Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(ifoV1Abi, address, signer) as unknown as IfoV1
}
export const getIfoV2Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(ifoV2Abi, address, signer) as unknown as IfoV2
}
export const getIfoV3Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(ifoV3Abi, address, signer)
}
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract(abi, getAddress(config.contractAddress), signer) as unknown as SousChef
}
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), signer) as unknown as SousChefV2
}

export const getPointCenterIfoContract = (signer?: Signer | Provider) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), signer) as unknown as PointCenterIfo
}
export const getCakeContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract(cakeAbi, chainId ? CAKE[chainId].address : CAKE[ChainId.BSC].address, signer) as unknown as Cake
}
export const getProfileContract = (signer?: Signer | Provider) => {
  return getContract(profileABI, getPancakeProfileAddress(), signer) as unknown as PancakeProfile
}
export const getPancakeBunniesContract = (signer?: Signer | Provider) => {
  return getContract(pancakeBunniesAbi, getPancakeBunniesAddress(), signer) as unknown as PancakeBunnies
}
export const getBunnyFactoryContract = (signer?: Signer | Provider) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), signer) as unknown as BunnyFactory
}
export const getBunnySpecialContract = (signer?: Signer | Provider) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), signer) as unknown as BunnySpecial
}
export const getLotteryV2Contract = (signer?: Signer | Provider) => {
  return getContract(lotteryV2Abi, getLotteryV2Address(), signer) as unknown as LotteryV2
}
export const getMasterchefContract = (signer?: Signer | Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer) as unknown as Masterchef
}
export const getMasterchefV1Contract = (signer?: Signer | Provider) => {
  return getContract(masterChefV1, getMasterChefV1Address(), signer) as unknown as MasterchefV1
}
export const getClaimRefundContract = (signer?: Signer | Provider) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), signer) as unknown as ClaimRefund
}
export const getTradingCompetitionContractEaster = (signer?: Signer | Provider) => {
  return getContract(
    tradingCompetitionEasterAbi,
    getTradingCompetitionAddressEaster(),
    signer,
  ) as unknown as TradingCompetitionEaster
}

export const getTradingCompetitionContractFanToken = (signer?: Signer | Provider) => {
  return getContract(
    tradingCompetitionFanTokenAbi,
    getTradingCompetitionAddressFanToken(),
    signer,
  ) as unknown as TradingCompetitionFanToken
}
export const getTradingCompetitionContractMobox = (signer?: Signer | Provider) => {
  return getContract(
    tradingCompetitionMoboxAbi,
    getTradingCompetitionAddressMobox(),
    signer,
  ) as unknown as TradingCompetitionMobox
}

export const getTradingCompetitionContractMoD = (signer?: Signer | Provider) => {
  return getContract(
    tradingCompetitionMoDAbi,
    getTradingCompetitionAddressMoD(),
    signer,
  ) as unknown as TradingCompetitionMoD
}

export const getEasterNftContract = (signer?: Signer | Provider) => {
  return getContract(easterNftAbi, getEasterNftAddress(), signer) as unknown as EasterNft
}
export const getCakeVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract(cakeVaultV2Abi, getCakeVaultAddress(), signer) as unknown as CakeVaultV2
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract(
    cakeFlexibleSideVaultV2Abi,
    getCakeFlexibleSideVaultAddress(),
    signer,
  ) as unknown as CakeFlexibleSideVaultV2
}

export const getPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract(predictionsAbi, address, signer) as unknown as Predictions
}

export const getPredictionsV1Contract = (signer?: Signer | Provider) => {
  return getContract(predictionsV1Abi, getPredictionsV1Address(), signer) as unknown as PredictionsV1
}

export const getCakePredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract(cakePredictionsAbi, address, signer) as unknown as Predictions
}

export const getChainlinkOracleContract = (address: string, signer?: Signer | Provider) => {
  return getContract(chainlinkOracleAbi, address, signer) as unknown as ChainlinkOracle
}
export const getMulticallContract = () => {
  return getContract(MultiCallAbi, getMulticallAddress(), bscRpcProvider) as unknown as Multicall
}
export const getBunnySpecialCakeVaultContract = (signer?: Signer | Provider) => {
  return getContract(
    bunnySpecialCakeVaultAbi,
    getBunnySpecialCakeVaultAddress(),
    signer,
  ) as unknown as BunnySpecialCakeVault
}
export const getBunnySpecialPredictionContract = (signer?: Signer | Provider) => {
  return getContract(
    bunnySpecialPredictionAbi,
    getBunnySpecialPredictionAddress(),
    signer,
  ) as unknown as BunnySpecialPrediction
}
export const getBunnySpecialLotteryContract = (signer?: Signer | Provider) => {
  return getContract(bunnySpecialLotteryAbi, getBunnySpecialLotteryAddress(), signer) as unknown as BunnySpecialLottery
}
export const getBunnySpecialXmasContract = (signer?: Signer | Provider) => {
  return getContract(bunnySpecialXmasAbi, getBunnySpecialXmasAddress(), signer)
}
export const getFarmAuctionContract = (signer?: Signer | Provider) => {
  return getContract(farmAuctionAbi, getFarmAuctionAddress(), signer) as unknown as FarmAuction
}
export const getAnniversaryAchievementContract = (signer?: Signer | Provider) => {
  return getContract(
    anniversaryAchievementAbi,
    getAnniversaryAchievement(),
    signer,
  ) as unknown as AnniversaryAchievement
}

export const getNftMarketContract = (signer?: Signer | Provider) => {
  return getContract(nftMarketAbi, getNftMarketAddress(), signer) as unknown as NftMarket
}
export const getNftSaleContract = (signer?: Signer | Provider) => {
  return getContract(nftSaleAbi, getNftSaleAddress(), signer) as unknown as NftSale
}
export const getPancakeSquadContract = (signer?: Signer | Provider) => {
  return getContract(pancakeSquadAbi, getPancakeSquadAddress(), signer) as unknown as PancakeSquad
}
export const getErc721CollectionContract = (signer?: Signer | Provider, address?: string) => {
  return getContract(erc721CollectionAbi, address, signer) as unknown as Erc721collection
}

export const getPotteryVaultContract = (address: string, signer?: Signer | Provider) => {
  return getContract(potteryVaultAbi, address, signer) as unknown as PotteryVaultAbi
}

export const getPotteryDrawContract = (signer?: Signer | Provider) => {
  return getContract(potteryDrawAbi, getPotteryDrawAddress(), signer) as unknown as PotteryDrawAbi
}

export const getZapContract = (signer?: Signer | Provider) => {
  return getContract(zapAbi, getZapAddress(), signer) as unknown as Zap
}

export const getIfoCreditAddressContract = (signer?: Signer | Provider) => {
  return getContract(iCakeAbi, getICakeAddress(), signer) as unknown as ICake
}
