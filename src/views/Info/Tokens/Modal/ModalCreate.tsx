import { Button, Flex, Input, InputGroup, Modal, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import styled from 'styled-components'
import { addProductClient } from 'views/Info/components/InfoTables/config'

interface Proptype {
  onDismiss?: () => void
  onRefresh?: (newValue) => void
}
const ModalCreate: React.FC<Proptype> = ({ onDismiss, onRefresh }) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [limit, setLimit] = useState(1)
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
      onDismiss()
      onRefresh('Reset')
    } catch (error) {
      console.log(error)
    }
  }

  const { account } = useWeb3React()

  const [check, setCheck] = useState(0)

  const checkValidate = (addressV) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(addressV)) {
      setCheck(1)
    } else if (addressV === account) {
      setCheck(2)
    } else {
      setCheck(0)
    }
  }

  const handleInputChangeAddress = (e) => {
    const value = e.target.value
    setAddress(value)
    checkValidate(value)
  }
  return (
    <Modal title="Claim Bounty" onDismiss={onDismiss}>
      <Flex width="80vw" flexDirection="column" justifyContent="center" alignItems="center">
        <Flex width="50%" flexDirection="column" justifyContent="center" alignItems="center">
          <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="20%">
              <Text color="primary">Name: </Text>
            </Flex>
            <Flex width="80%">
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
          </Flex>
          <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="20%">
              <Text color="primary">address: </Text>
            </Flex>
            <Flex width="80%">
              <CustomInputGroup>
                <Input
                  type="address"
                  name="address"
                  placeholder="enter an address"
                  onChange={handleInputChangeAddress}
                  color="primary"
                />
              </CustomInputGroup>
            </Flex>
          </Flex>
          <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="20%">
              <Text color="primary">Limit: </Text>
            </Flex>
            <Flex width="80%">
              <CustomInputGroup>
                <Input
                  type="number"
                  name="limit"
                  placeholder="enter an limit"
                  value={limit}
                  onChange={(e) => setLimit(parseFloat(e.target.value))}
                  color="primary"
                />
              </CustomInputGroup>
            </Flex>
          </Flex>
        </Flex>
        <Flex mt="2rem">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={Number.isNaN(limit) !== false || limit <= 0 || name === '' || address === '' || check !== 0}
          >
            Create
          </Button>
        </Flex>
        <Flex>
          {check === 2 && (
            <Text marginTop="1rem" width="100%" textAlign="center">
              Địa chỉ nhận đang là ví của bạn
            </Text>
          )}
          {check === 1 && (
            <Text marginTop="1rem" width="100%" textAlign="center">
              Địa chỉ ví không đúng
            </Text>
          )}
          {name === '' && (
            <Text marginTop="1rem" width="100%" textAlign="center">
              Tên ví trống
            </Text>
          )}
        </Flex>
      </Flex>
    </Modal>
  )
}

export default ModalCreate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
