import { Flex, Heading, Text } from "@chakra-ui/react";
import { useAtomValue } from "../flotai/flotai";
import { textAtom } from "../flotai/store";


export const Component2: React.FC = () => {
  const text = useAtomValue<string>(textAtom);
  return (
    <Flex border="1px solid lightgrey" p="1em" gap={2} flexDir="column">
      <Heading as="h4" fontSize="1em">Component 2</Heading>
      <Text><Text as="span" fontSize="xs">This gets updated:</Text> {text}</Text>
    </Flex>
  )
}