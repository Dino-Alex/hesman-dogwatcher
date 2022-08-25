import { Button, Flex, Input, InputGroup, Modal, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { useState } from 'react'
import styled from 'styled-components'
import { addProductClient } from 'views/Info/components/InfoTables/config'

interface Proptype {
  onDismiss?: () => void
  onRefresh?: (newValue) => void
  ID?: any
}

const ModalDelete: React.FC<Proptype> = ({ onDismiss, onRefresh, ID }) => {
  const tokenAuth = localStorage.getItem('token')
  const [posts, setPosts] = useState([])

  const deletePost = async () => {
    await axios.delete(`https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/admin/product/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
        token: `${tokenAuth}`,
      },
    })
    onRefresh('Reset')
    onDismiss()
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
    <Modal title="Delete" onDismiss={onDismiss}>
      <Flex width="20vw" justifyContent="center" alignItems="center">
        <Flex width="100%" justifyContent="space-around">
          <CustomButton onClick={deletePost}>Delete</CustomButton>
          <Button onClick={handleCancel}>Cancel</Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default ModalDelete

const CustomButton = styled(Button)`
  background-color: red;
`
