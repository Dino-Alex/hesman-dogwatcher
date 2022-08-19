import { Button, Flex, Input, InputGroup, Text } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'

const Login = () => {
  return (
    <Container>
      <FormLogin>
        <Flex flexDirection="column">
          <Flex width="100%" justifyContent="center" alignItems="center">
            <Text fontSize="20px">Login</Text>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Flex width="30%">
                <Text>Tài Khoản</Text>
              </Flex>
              <Flex width="70%">
                <Input />
              </Flex>
            </Flex>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Flex width="30%">
                <Text>Mật Khẩu</Text>
              </Flex>
              <Flex width="70%">
                <Input />
              </Flex>
            </Flex>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Button>Login</Button>
          </Flex>
        </Flex>
      </FormLogin>
    </Container>
  )
}

export default Login

const Container = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const FormLogin = styled.div`
  width: 500px;
  height: 500px;
  border-style: 3px double red;
  z-index: 1000;
`
