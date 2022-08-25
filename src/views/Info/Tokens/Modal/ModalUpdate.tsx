import { Button, Flex, Input, InputGroup, Modal, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getSingleProductClient } from 'views/Info/components/InfoTables/config'

interface Proptype {
  onDismiss?: () => void
  onRefresh?: (newValue) => void
  id?: any
}

const ModalUpdate: React.FC<Proptype> = ({ onDismiss, onRefresh, id }) => {
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState('')
  const [limit, setLimit] = useState(1)
  const [posts, setPosts] = useState([])
  const [walletInfo, setWalletInfo] = useState('')
  const tokenAuth = localStorage.getItem('token')

  useEffect(() => {
    getSingleProductClient.get(`${id}`).then((response) => {
      if (walletInfo === '') {
        setWalletInfo(response.data.product)
        setName(response.data.product.name)
        setAddress(response.data.product.address)
        setLimit(response.data.product.limit)
      }
    })
  }, [walletInfo])

  const updatePost = async () => {
    await axios.put(
      `https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/admin/product/${id}`,
      { name: name, address: address, limit: limit },
      {
        headers: {
          'Content-Type': 'application/json',
          token: `${tokenAuth}`,
        },
      },
    )
    onRefresh('Reset')
    onDismiss()
    setPosts(
      posts.filter((post) => {
        return post !== id
      }),
    )
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
    <Modal title="Update Team Wallet" onDismiss={onDismiss}>
      <Flex width="70vw" flexDirection="column" justifyContent="center" alignItems="center">
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
                <Input color="primary" value={address} onChange={handleInputChangeAddress} />
              </CustomInputGroup>
            </Flex>
          </Flex>
          <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="20%">
              <Text color="primary">Limit: </Text>
            </Flex>
            <Flex width="80%">
              <CustomInputGroup>
                <Input color="primary" value={limit} onChange={(e) => setLimit(parseFloat(e.target.value))} />
              </CustomInputGroup>
            </Flex>
          </Flex>
        </Flex>
        <Flex mt="2rem">
          <Button
            onClick={updatePost}
            disabled={Number.isNaN(limit) !== false || limit <= 0 || name === '' || address === '' || check !== 0}
          >
            Update
          </Button>
        </Flex>

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
    </Modal>
  )
}

export default ModalUpdate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
