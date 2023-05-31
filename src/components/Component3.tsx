import { Flex, Heading, Text } from "@chakra-ui/react";
import { useAtomValue } from "../flotai/flotai";
import { numberAtom } from "../flotai/store";


export const Component3: React.FC = () => {
  const number = useAtomValue(numberAtom);
  return (
    <Flex border="1px solid lightgrey" p="1em" gap={2} flexDir="column">
      <Heading as="h4" fontSize="1em">Component 3</Heading>
      <Text as="span" fontSize="xs">This gets updated:</Text> {number}
    </Flex>
  )
}