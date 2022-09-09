import { Button, Flex, Input, Text } from '@pancakeswap/uikit'
import { key } from 'localforage'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { loginClient } from 'views/Info/components/InfoTables/config'

const Login = () => {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [posts, setPosts] = useState([])
  const [padding, setPadding] = useState(false)
  const [check, setCheck] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const resp = await loginClient.post('', { name: userName, password: passWord }).then((response) => {
        setPosts([response.data, ...posts])
        localStorage.setItem('token', response.data.token)
        router.push('/info/token/0xc643e83587818202e0fff5ed96d10abbc8bb48e7')
      })
      setPadding(true)
    } catch (error: any) {
      console.log(error.response.status)
      setCheck(error.response.status)
      console.log(error)
    }
  }
  function handleBack() {
    router.push('/info/token/0xc643e83587818202e0fff5ed96d10abbc8bb48e7')
  }

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        handleSubmit(event)
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [userName, passWord])

  return (
    <Container>
      <FormLogin>
        <Flex flexDirection="column">
          <Flex width="100%" justifyContent="center" alignItems="center">
            <Text fontSize="20px">Login</Text>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Flex width="20%">
                <Text>Username</Text>
              </Flex>
              <Flex width="70%">
                <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
              </Flex>
            </Flex>
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="center" alignItems="center">
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Flex width="20%">
                <Text>Password</Text>
              </Flex>
              <Flex width="70%">
                <Input id="myInputID" value={passWord} onChange={(e) => setPassWord(e.target.value)} type="password" />
              </Flex>
            </Flex>
          </Flex>
          <Flex>
            {check === 401 && (
              <Text marginTop="1rem" width="100%" textAlign="center">
                Invalid username or password
              </Text>
            )}
          </Flex>
          <Flex mt="5rem" width="100%" justifyContent="space-around" alignItems="center">
            <Button onClick={handleSubmit} disabled={padding === true || passWord === '' || userName === ''}>
              Login
            </Button>
            <ButtonBack onClick={handleBack} disabled={padding === true}>
              Back
            </ButtonBack>
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
  @media screen and (max-width: 600px) {
    width: 90%;
  }
`
const ButtonBack = styled(Button)`
  background: red;
`
