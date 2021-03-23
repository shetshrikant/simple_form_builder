import { render } from 'react-dom'
import FormBuilder from './FormBuilder'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <div className='App'>
      <ChakraProvider>
        <DndProvider backend={HTML5Backend}>
          <FormBuilder />
        </DndProvider>
      </ChakraProvider>
    </div>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
