import { Button, Flex, Input, InputGroup, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getSingleProductClient } from 'views/Info/components/InfoTables/config'

const ModalUpdate = (id: any) => {
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState('')
  const [limit, setLimit] = useState('')
  const [posts, setPosts] = useState([])
  const [walletInfo, setWalletInfo] = useState('')
  const tokenAuth = localStorage.getItem('token')
  const [noti, setNoti] = useState('')

  useEffect(() => {
    getSingleProductClient.get(`${id.id}`).then((response) => {
      if (walletInfo === '') {
        setWalletInfo(response.data.product)
        setName(response.data.product.name)
        setAddress(response.data.product.address)
        setLimit(response.data.product.limit)
      }
    })
  }, [walletInfo])
  const updatePost = async () => {
    console.log('id', id)
    await axios
      .put(
        `https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/admin/product/${id.id}`,
        { name, address, limit },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `${tokenAuth}`,
          },
        },
      )
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          setNoti('Success')
        }
      })
      .catch((err) => {
        console.log(err)
        setNoti('Fail')
      })
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
          <Flex width="20%">
            <Text color="primary">Name: </Text>
          </Flex>
          <Flex width="80%">
            <CustomInputGroup>
              <Input color="primary" value={name} onChange={(e) => setName(e.target.value)} />
            </CustomInputGroup>
          </Flex>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Flex width="20%">
            <Text color="primary">Address: </Text>
          </Flex>
          <Flex width="80%">
            <CustomInputGroup>
              <Input color="primary" value={address} onChange={(e) => setAddress(e.target.value)} />
            </CustomInputGroup>
          </Flex>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Flex width="20%">
            <Text color="primary">Limit: </Text>
          </Flex>
          <Flex width="80%">
            <CustomInputGroup>
              <Input color="primary" value={limit} onChange={(e) => setLimit(e.target.value)} />
            </CustomInputGroup>
          </Flex>
        </Flex>
      </Flex>
      <Flex mt="2rem">
        <Button onClick={updatePost}>Update</Button>
      </Flex>
      {noti && <Text>Thành công</Text>}
    </Flex>
  )
}

export default ModalUpdate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
