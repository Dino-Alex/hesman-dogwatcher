import { Button, Flex, Input, InputGroup, Modal, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { createContext, useState } from 'react'
import styled from 'styled-components'

interface Proptype {
  onDismiss?: () => void
  onRefresh?: (newValue) => void
  ID?: any
}

const RefreshDelete = []

export const RefreshTrackingDeleteGlobal = createContext(RefreshDelete)

const ModalTrackingDelete: React.FC<Proptype> = ({ onDismiss, onRefresh, ID }) => {
  const tokenAuth = localStorage.getItem('token')
  const [posts, setPosts] = useState([])

  const deletePost = async () => {
    await axios.delete(`http://localhost:4000/api/v1/admin/tracking/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
        token: `${tokenAuth}`,
      },
    })
    onRefresh('Reset')
    onDismiss()
    RefreshDelete.push('Delete')
    setPosts(
      posts.filter((post) => {
        return post.id !== ID
      }),
    )
  }

  function handleCancel() {
    onDismiss()
  }

  return (
    <CustomModal title="Delete" onDismiss={onDismiss}>
      <CustomFlex width="20vw" justifyContent="center" alignItems="center">
        <Flex width="100%" justifyContent="space-around" alignItems="center">
          <CustomButton onClick={deletePost}>Delete</CustomButton>
          <Button onClick={handleCancel}>Cancel</Button>
        </Flex>
      </CustomFlex>
    </CustomModal>
  )
}

export default ModalTrackingDelete

const CustomButton = styled(Button)`
  background-color: red;
`
const CustomModal = styled(Modal)`
  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    width: 75%;
    margin-bottom: 15rem;
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
const CustomFlex = styled(Flex)`
  width: 100%;
  height: 100%;
`
