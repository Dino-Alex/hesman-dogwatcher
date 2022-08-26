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
      { name, address, limit },
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
    <CustomModal title="Update Team Wallet" onDismiss={onDismiss}>
      <CustomFlex width="70vw" flexDirection="column" justifyContent="center" alignItems="center">
        <Flex width="50%" flexDirection="column" justifyContent="center" alignItems="center">
          <CustomFlexInput mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <FlexInput width="20%">
              <Text color="primary">Name: </Text>
            </FlexInput>
            <FlexInput width="80%">
              <CustomInputGroup>
                <Input color="primary" value={name} onChange={(e) => setName(e.target.value)} />
              </CustomInputGroup>
            </FlexInput>
          </CustomFlexInput>
          <CustomFlexInput mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <FlexInput width="20%">
              <Text color="primary">Address: </Text>
            </FlexInput>
            <FlexInput width="80%">
              <CustomInputGroup>
                <Input color="primary" value={address} onChange={handleInputChangeAddress} />
              </CustomInputGroup>
            </FlexInput>
          </CustomFlexInput>
          <CustomFlexInput mt="2rem" width="100%" justifyContent="center" alignItems="center">
            <FlexInput width="20%">
              <Text color="primary">Limit: </Text>
            </FlexInput>
            <FlexInput width="80%">
              <CustomInputGroup>
                <Input color="primary" value={limit} onChange={(e) => setLimit(parseFloat(e.target.value))} />
              </CustomInputGroup>
            </FlexInput>
          </CustomFlexInput>
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
      </CustomFlex>
    </CustomModal>
  )
}

export default ModalUpdate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
const CustomFlex = styled(Flex)`
  margin-bottom: 10rem;
  width: 100%;
  height: 100px;
  padding-top: 10rem;
`

const CustomFlexInput = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  @media screen and (min-width: 601px) and (max-width: 768px) {
    width: 600px;
  }
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    width: 700px;
    margin-top: 1rem;
  }
  @media screen and (min-width: 1025px) and (max-width: 1440px) {
    width: 700px;
    margin-top: 1rem;
  }
  @media screen and (min-width: 1441px) and (max-width: 2556px) {
    width: 700px;
    margin-top: 1rem;
  }
`
const FlexInput = styled(Flex)`
  @media screen and (max-width: 600px) {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: -20px;
  }
`
const CustomModal = styled(Modal)`
  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 80%;
    margin-bottom: 5rem;
    border-radius: 30px;
  }

  @media screen and (min-width: 601px) and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 70%;
    margin-bottom: 5rem;
    border-radius: 30px;
  }
`
