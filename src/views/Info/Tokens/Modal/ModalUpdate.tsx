import { Button, Flex, Input, InputGroup, Text } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'

const ModalUpdate = () => {
  return (
    <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
      <Flex width="50%" flexDirection="column" justifyContent="center" alignItems="center">
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Name: </Text>
          <CustomInputGroup>
            <Input color="primary" />
          </CustomInputGroup>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Address: </Text>
          <CustomInputGroup>
            <Input color="primary" />
          </CustomInputGroup>
        </Flex>
        <Flex mt="2rem" width="100%" justifyContent="center" alignItems="center">
          <Text color="primary">Limit: </Text>
          <CustomInputGroup>
            <Input color="primary" />
          </CustomInputGroup>
        </Flex>
      </Flex>
      <Flex mt="2rem">
        <Button>Create</Button>
      </Flex>
    </Flex>
  )
}

export default ModalUpdate

const CustomInputGroup = styled(InputGroup)`
  background: 'primary';
  margin-left: 2rem;
`
