import { Button, Flex, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import { useAtom, useAtomSet } from "../flotai/flotai";
import { numberAtom, textAtom, asyncAtom, mockServer } from "../flotai/store";
import { useState } from "react";

export const InputForm: React.FC = () => {
  const [text, setText] = useAtom<string>(textAtom);
  const [number, setNumber] = useAtom(numberAtom);
  const [serverData, setServerData] = useState<"" | "Refetch">("")
  const setData = useAtomSet(asyncAtom);

  return (
    <Flex border="1px solid peachpuff" p="1em" gap={6} flexDir="column">
      <Heading as="h4" color="peachpuff" fontSize="1em">Input</Heading>
      <FormControl>
        <FormLabel fontSize="xs" m="0" fontStyle="italic">Modifies text atom in Component 1 and 2</FormLabel>
        <Input placeholder={text} size='md' onChange={e => setText(e.currentTarget.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" m="0" fontStyle="italic">Modifies number atom in Component 3</FormLabel>
        <Input type="number" placeholder={`${number}`} size='md' onChange={e => setNumber(parseInt(e.currentTarget.value))} />
      </FormControl>
      <FormControl>
        <Button colorScheme="teal" onClick={() => {
          const d = serverData === "" ? "Refetch" : "" 
          setData(mockServer(1000, d));
          setServerData(d);
        }}>
          Change Source Data
        </Button>
      </FormControl>
    </Flex>
  )
}