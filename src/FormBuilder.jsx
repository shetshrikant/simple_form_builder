import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { DragText } from './DragText'
import { DragInput } from './DragInput'
import { DragButton } from './DragButton'
import update from 'immutability-helper'
import { Box, Flex, Text, Link, Button } from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CloseIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from '@chakra-ui/react'

const FormBuilder = () => {
  const [items, setItems] = useState({
    1: { top: 20, left: 80, label: 'What is your name?', type: 'Text' },
    2: {
      top: 180,
      left: 20,
      label: 'What is your phone number?',
      type: 'Text',
    },
    3: {
      top: 50,
      left: 10,
      label: 'Phone number',
      type: 'Input',
    },
    4: {
      top: 100,
      left: 20,
      label: 'Name',
      type: 'Input',
    },
    5: { top: 100, left: 20, label: 'Drag me too', type: 'Button' },
  })

  const moveItem = useCallback(
    (id, left, top) => {
      setItems(
        update(items, {
          [id]: {
            $merge: { left, top },
          },
        })
      )
    },
    [items, setItems]
  )
  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.TEXT, ItemTypes.BUTTON, ItemTypes.INPUT],
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveItem(item.id, left, top)
        return undefined
      },
    }),
    [moveItem]
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const handleEdit = async (id) => {
    await setEditingId(id)
    await setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    let newItems = { ...items }
    delete newItems[id]
    await setItems(newItems)
  }

  const EditingModal = () => {
    const updateItem = (id, top, left, label) => {
      setItems(
        update(items, {
          [id]: {
            $merge: { left, top, label },
          },
        })
      )
    }
    return (
      <Modal isOpen={isModalOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex alignItems='center'>
              <Text>
                {items[editingId].type === 'Text'
                  ? 'Edit Label'
                  : items[editingId].type === 'Button'
                  ? 'Edit Button'
                  : items[editingId].type === 'Input'
                  ? 'Edit Input'
                  : 'Unknown Entity'}
              </Text>
              <CloseIcon
                cursor='pointer'
                ml='auto'
                w={4}
                h={4}
                color='black'
                onClick={() => {
                  setEditingId(null)
                  setIsModalOpen(false)
                }}
              />
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                top: items[editingId].top,
                left: items[editingId].left,
                label: items[editingId].label,
              }}
              validationSchema={Yup.object({
                top: Yup.number()
                  .required('Required')
                  .max(
                    document.getElementById('canvas').offsetHeight,
                    `Max allowed is ${
                      document.getElementById('canvas').offsetHeight
                    }`
                  ),
                left: Yup.number()
                  .required('Required')
                  .max(
                    document.getElementById('canvas').offsetWidth,
                    `Max allowed is ${
                      document.getElementById('canvas').offsetWidth
                    }`
                  ),
                label: Yup.string().required('Required'),
              })}
              onSubmit={(values, { setSubmitting, setErrors }) => {
                updateItem(editingId, values.top, values.left, values.label)
                setIsModalOpen(false)
                setEditingId(null)
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <Form>
                  <Text pt={8}>Text</Text>
                  <Input
                    name='label'
                    value={values.label}
                    type='text'
                    onChange={handleChange}
                    required
                    borderRadius={0}
                  />
                  {touched && errors.label ? (
                    <Text
                      color='red.500'
                      pt={0}
                      pb={2}
                      className='error'
                      textAlign='left'
                      ml='2'
                    >
                      {errors.label}
                    </Text>
                  ) : null}
                  <Text pt={8}>X</Text>
                  <Input
                    name='left'
                    value={values.left}
                    type='number'
                    onChange={handleChange}
                    required
                    borderRadius={0}
                  />
                  {touched && errors.left ? (
                    <Text
                      color='red.500'
                      pt={0}
                      pb={2}
                      className='error'
                      textAlign='left'
                      ml='2'
                    >
                      {errors.left}
                    </Text>
                  ) : null}
                  <Text pt={8}>Y</Text>
                  <Input
                    name='top'
                    value={values.top}
                    type='number'
                    onChange={handleChange}
                    required
                    borderRadius={0}
                  />
                  {touched && errors.top ? (
                    <Text
                      color='red.500'
                      pt={0}
                      pb={2}
                      className='error'
                      textAlign='left'
                      ml='2'
                    >
                      {errors.top}
                    </Text>
                  ) : null}
                  <Button
                    my={8}
                    borderRadius={0}
                    bg='#2462C1'
                    textColor='white'
                    fontWeight={'normal'}
                    _hover={{ bg: '#2462C1', textColor: 'white' }}
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  const handleAddComponent = (top, left, label, type) => {
    let presentItems = { ...items }
    const newItemKey = Math.max(...Object.keys(presentItems)) + 1
    presentItems[newItemKey] = {
      top,
      left,
      label,
      type,
    }
    setItems(presentItems)
  }

  return (
    <>
      {editingId ? <EditingModal /> : null}
      <Flex>
        <Box
          ref={drop}
          height='100vh'
          position='relative'
          bg='#F3F3F3'
          id='canvas'
          flex={8}
        >
          {Object.keys(items).map((key) => {
            const { left, top, label, type } = items[key]
            if (type === 'Input') {
              return (
                <Link
                  _active={{ bg: 'none' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEdit(key)
                    }
                    if (e.key === 'Delete') {
                      handleDelete(key)
                    }
                  }}
                  key={key}
                >
                  <DragInput
                    type='text'
                    id={key}
                    left={left}
                    top={top}
                    label={label}
                  />
                </Link>
              )
            } else if (type === 'Button') {
              return (
                <Link
                  _active={{ bg: 'none' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEdit(key)
                    }
                    if (e.key === 'Delete') {
                      handleDelete(key)
                    }
                  }}
                  key={key}
                >
                  <DragButton id={key} left={left} top={top} label={label}>
                    {label}
                  </DragButton>
                </Link>
              )
            } else if (type === 'Text') {
              return (
                <Link
                  _active={{ bg: 'none' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEdit(key)
                    }
                    if (e.key === 'Delete') {
                      handleDelete(key)
                    }
                  }}
                  key={key}
                >
                  <DragText id={key} left={left} top={top} label={label} />
                </Link>
              )
            }
            return null
          })}
        </Box>
        <Box flex={2} bg='#2D2D2D'>
          <Text
            textColor='white'
            py={4}
            pl={4}
            fontWeight='extrabold'
            fontSize='2xl'
          >
            BLOCKS
          </Text>
          <Flex
            mx='4'
            p={2}
            my={2}
            bg='#FFFFFF'
            borderRadius={4}
            cursor='pointer'
            alignItems='center'
            onClick={() => {
              handleAddComponent(10, 10, 'New text just added', 'Text')
            }}
          >
            <DragHandleIcon mr={2} w={4} h={4} color='#D4D4D4' />
            Add a Label
          </Flex>
          <Flex
            mx='4'
            p={2}
            my={2}
            bg='#FFFFFF'
            borderRadius={4}
            cursor='pointer'
            alignItems='center'
            onClick={() => {
              handleAddComponent(10, 10, 'New button just added', 'Button')
            }}
          >
            <DragHandleIcon mr={2} w={4} h={4} color='#D4D4D4' />
            Add a Button
          </Flex>
          <Flex
            mx='4'
            p={2}
            my={2}
            bg='#FFFFFF'
            borderRadius={4}
            cursor='pointer'
            alignItems='center'
            onClick={() => {
              handleAddComponent(10, 10, 'New input just added', 'Input')
            }}
          >
            <DragHandleIcon mr={2} w={4} h={4} color='#D4D4D4' />
            Add an Input Box
          </Flex>
          <Box
            mx='4'
            p={2}
            my={8}
            bg='#FFFFFF'
            borderRadius={4}
            alignItems='center'
          >
            Note: To edit, select element and press enter. To delete, select
            element and press delete.
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default FormBuilder
