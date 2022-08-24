import { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import ModalCreate from 'views/Info/Tokens/Modal/ModalCreate'
import {
  Text,
  PancakeToggle,
  Toggle,
  Flex,
  Modal,
  InjectedModalProps,
  ThemeSwitcher,
  Box,
  Button,
  useModal,
} from '@pancakeswap/uikit'
import {
  useAudioModeManager,
  useExpertModeManager,
  useSubgraphHealthIndicatorManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
  useZapModeManager,
} from 'state/user/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import axios from 'axios'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'
import { SettingsMode } from './types'

const Refresh = []
const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const router = useRouter()
  const [isLogOut, setLogOut] = useState(true)

  function handleClickLogIn() {
    onDismiss()
    router.push('/login')
  }

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

  const [handleClickCreate] = useModal(<ModalCreate onRefresh={(newValue) => Refresh.push(newValue)} />)

  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const [zapMode, toggleZapMode] = useZapModeManager()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()
  const { isDark, setTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  const tokenAuth = localStorage.getItem('token')
  return (
    <Modal
      title={t('Settings')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px' }}
    >
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <Flex justifyContent="space-between" mb="24px">
                <Text>{t('Dark mode')}</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              <Flex>
                {tokenAuth !== null && isLogOut ? (
                  <Flex width="100%" flexDirection="row" justifyContent="space-around">
                    <Button onClick={() => handleClickCreate()}>{t('Create')}</Button>
                    <Button onClick={() => handleClickLogOut()}>{t('LOGOUT')}</Button>
                  </Flex>
                ) : (
                  <>
                    <Button onClick={() => handleClickLogIn()}>{t('LOGIN')}</Button>
                  </>
                )}
              </Flex>
            </Flex>
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
