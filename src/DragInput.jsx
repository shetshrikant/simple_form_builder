import { useDrag } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { Input, Box } from '@chakra-ui/react'

export const DragInput = ({ id, left, top, type, label }) => {
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
    <Input
      placeholder={label}
      type={type}
      ref={drag}
      style={{ left, top }}
      w={80}
      bg='white'
      borderRadius={0}
      position='absolute'
      backgroundColor='white'
      cursor='move'
      focusBorderColor='#D9562A'
      maxW='100vw'
      tabIndex={id}
      id={id}
    />
  )
}
