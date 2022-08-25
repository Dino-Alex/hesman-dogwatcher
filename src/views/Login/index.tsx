import { Button, Flex, Input, Text } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import { loginClient } from 'views/Info/components/InfoTables/config'

const Login = () => {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [posts, setPosts] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const resp = await loginClient.post('', { name: userName, password: passWord }).then((response) => {
        setPosts([response.data, ...posts])
        localStorage.setItem('token', response.data.token)
        router.push('/')
      })
      // onRefresh(false);
    } catch (error) {
      console.log(error)
    }
  }
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
                <Text>Username</Text>
              </Flex>
              <Flex width="70%">
                <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
              </Flex>
            </Flex>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Flex width="30%">
                <Text>Password</Text>
              </Flex>
              <Flex width="70%">
                <Input value={passWord} onChange={(e) => setPassWord(e.target.value)} type="password" />
              </Flex>
            </Flex>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Button onClick={handleSubmit}>Login</Button>
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
