import { useDrag } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { Button, Box } from '@chakra-ui/react'

export const DragText = ({ id, left, top, label }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TEXT,
      item: { id, left, top, label },
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
      ref={drag}
      style={{ left, top }}
      position='absolute'
      cursor='move'
      textColor='#000000'
      maxW='100vw'
      variant='unstyled'
      _focus={{ outline: '2px solid #D9562A' }}
      tabIndex={id}
      id={id}
      bg='transparent'
      fontWeight='normal'
    >
      {label}
    </Button>
  )
}
