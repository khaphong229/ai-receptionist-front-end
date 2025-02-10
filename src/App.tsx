import useRouteElements from '@/useRouteElements'
import './App.css'
import { ThemeProvider } from '@/components/ThemeProvider'

function App() {
  const routeElements = useRouteElements()
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        {routeElements}
      </ThemeProvider>
    </>
  )
}

export default App
