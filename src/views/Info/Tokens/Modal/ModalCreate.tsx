import { Button, Flex, Input, InputGroup, Text } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { addProductClient, getProductClient } from 'views/Info/components/InfoTables/config'
import SetPriceStage from 'views/Nft/market/components/BuySellModals/SellModal/SetPriceStage'

interface Proptype {
  onRefresh?: (newValue) => void
}
const ModalCreate: React.FC<Proptype> = ({ onRefresh }) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [limit, setLimit] = useState('')
  const [posts, setPosts] = useState([])

  const tokenAuth = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const resp = await axios
        .post(
          addProductClient,
          { name, address, limit },
          {
            headers: {
              'Content-Type': 'application/json',
              token: `${tokenAuth}`,
            },
          },
        )
        .then((response) => {
          setPosts([response.data, ...posts])
        })
      onRefresh(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
      <Flex width="50%" flexDirection="column" justifyContent="center" alignItems="center">
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Name: </Text>
          <CustomInputGroup>
            <Input
              type="name"
              name="name"
              placeholder="enter an name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              color="primary"
            />
          </CustomInputGroup>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">address: </Text>
          <CustomInputGroup>
            <Input
              type="address"
              name="address"
              placeholder="enter an address"
              onChange={(e) => setAddress(e.target.value)}
              color="primary"
            />
          </CustomInputGroup>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Limit: </Text>
          <CustomInputGroup>
            <Input
              type="limit"
              name="limit"
              placeholder="enter an limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              color="primary"
            />
          </CustomInputGroup>
        </Flex>
      </Flex>
      <Flex mt="2rem">
        <Button type="submit" onClick={handleSubmit}>
          Create
        </Button>
      </Flex>
    </Flex>
  )
}

export default ModalCreate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
