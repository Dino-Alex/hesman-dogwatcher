import { Button, Flex, Input, InputGroup, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useState } from 'react'
import axios from 'axios'
import { updateProductClient, getSingleProductClient } from 'views/Info/components/InfoTables/config'

const ModalUpdate = (id: any) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [limit, setLimit] = useState('')
  const [posts, setPosts] = useState([])
  const [walletInfo, setWalletInfo] = useState('')
  const tokenAuth = localStorage.getItem('token')

  getSingleProductClient.get(`${id}`).then((response) => {
    setWalletInfo(response.data.product)
    console.log('walletInfo', walletInfo)
  })
  const updatePost = async () => {
    console.log('id', id)
    await axios
      .put(
        `https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/admin/product/${id}`,
        { name, address, limit },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `${tokenAuth}`,
          },
        },
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    setPosts(
      posts.filter((post) => {
        return post.id !== id
      }),
    )
  }
  return (
    <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
      <Flex width="50%" flexDirection="column" justifyContent="center" alignItems="center">
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Name: </Text>
          <CustomInputGroup>
            <Input color="primary" onChange={(e) => setName(e.target.value)} />
          </CustomInputGroup>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Address: </Text>
          <CustomInputGroup>
            <Input color="primary" onChange={(e) => setAddress(e.target.value)} />
          </CustomInputGroup>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Limit: </Text>
          <CustomInputGroup>
            <Input color="primary" onChange={(e) => setLimit(e.target.value)} />
          </CustomInputGroup>
        </Flex>
      </Flex>
      <Flex mt="2rem">
        <Button onClick={updatePost}>Update</Button>
      </Flex>
    </Flex>
  )
}

export default ModalUpdate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
