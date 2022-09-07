import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Modal, Text, ThemeSwitcher, useModal } from '@pancakeswap/uikit'
import axios from 'axios'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { createContext, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useExpertModeManager, useUserExpertModeAcknowledgementShow } from 'state/user/hooks'
import styled from 'styled-components'
import ModalCreate from 'views/Info/Tokens/Modal/ModalCreate'
import ModalTrackingCreate from 'views/Info/Tokens/Modal/ModalTrackingCreate'
import ExpertModal from './ExpertModal'
import { SettingsMode } from './types'

const RefreshCreate = []

export const RefreshCreateGlobal = createContext(RefreshCreate)

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

  const [handleClickTeamCreate] = useModal(<ModalCreate onRefresh={(newValue) => RefreshCreate.push(newValue)} />)
  const [handleClickTrackingCreate] = useModal(
    <ModalTrackingCreate onRefresh={(newValue) => RefreshCreate.push(newValue)} />,
  )
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
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

  const tokenAuth = localStorage.getItem('token')
  return (
    <CustomModal
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
              <FlexCustom>
                {tokenAuth !== null && isLogOut ? (
                  <Flex width="100%" flexDirection="column" justifyContent="space-around">
                    <FlexCreate width="100%" flexDirection="row" justifyContent="space-around">
                      <CustomButton onClick={() => handleClickTeamCreate()}>{t('Create Team')}</CustomButton>
                      <CustomButton onClick={() => handleClickTrackingCreate()}>{t('Create Tracking')}</CustomButton>
                    </FlexCreate>
                    <Flex mt="1rem" justifyContent="center">
                      <Button onClick={() => handleClickLogOut()}>{t('LOGOUT')}</Button>
                    </Flex>
                  </Flex>
                ) : (
                  <Flex width="100%" flexDirection="row" justifyContent="center" alignItems="center">
                    <Button onClick={() => handleClickLogIn()}>{t('LOGIN')}</Button>
                  </Flex>
                )}
              </FlexCustom>
            </Flex>
          </>
        )}
      </ScrollableContainer>
    </CustomModal>
  )
}

export default SettingsModal

const CustomModal = styled(Modal)`
  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin-bottom: 10rem;
    border-radius: 30px;
  }

  @media screen and (min-width: 601px) and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 50%;
    margin-bottom: 15rem;
    border-radius: 30px;
  }
`
const FlexCreate = styled(Flex)`
  gap: 20px;
`
const FlexCustom = styled(Flex)`
@media screen and (max-width: 600px) {
    display: none;
  }

  @media screen and (min-width: 601px) and (max-width: 768px) {
    display: none;
  }

`
const CustomButton = styled(Button)`
  width: 150px;
`
