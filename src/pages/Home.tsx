import { Flex, Heading } from "@chakra-ui/react";
import { Component1, Component2, Component3, Component4 } from "../components";
import { InputForm } from "../components/InputForm";

export const Home: React.FC = () => {
  return (
    <Flex w="100%" h="100vh" bg="blackAlpha.900" color="whiteAlpha.700" p="2em" flexDir="column">
      <Flex border="1px solid teal" padding="1em" gap={8} flexDir="column">
        <Heading as="h4" color="teal" fontSize="1.5em">FloTai -- 🌱</Heading>
        <InputForm />
        <Component1 />
        <Component2 />
        <Component3 />
        <Component4 />
      </Flex>
    </Flex>
  )
}