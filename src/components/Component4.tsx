import { Flex, Heading, Text } from "@chakra-ui/react";
import { useAsyncAtom } from "../flotai/flotai";
import { asyncAtom } from "../flotai/store";


export const Component4: React.FC = () => {
  const data = useAsyncAtom(asyncAtom);

  return (
    <Flex border="1px solid lightgrey" p="1em" gap={2} flexDir="column">
      <Heading as="h4" fontSize="1em">Component 4</Heading>
      { data === null ? 
        <Text>Loading...</Text> :
        <Text><Text as="span" fontSize="xs">This gets gets fetched:</Text> {JSON.stringify(data)}</Text>
      }
    </Flex>
  )
}