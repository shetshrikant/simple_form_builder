import { useDrag } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { Button, Box } from '@chakra-ui/react'

export const DragButton = ({ id, left, top, type, label }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.INPUT,
      item: { id, left, top, type, label },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  )
  if (isDragging) {
    return <Box ref={drag} />
  }
  return (
    <Button
      id={id}
      ref={drag}
      style={{ left, top }}
      position='absolute'
      cursor='move'
      borderRadius={0}
      bg='#2462C1'
      textColor='white'
      _hover={{ bg: '#2462C1', textColor: 'white' }}
      maxW='100vw'
      _focus={{ border: '2px solid #D9562A' }}
      tabIndex={id}
    >
      {label}
    </Button>
  )
}
