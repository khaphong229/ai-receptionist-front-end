import { useRoutes } from 'react-router-dom'
import path from '@/constants/path'
import { lazy, Suspense } from 'react'
import RegisterLayout from '@/layouts/HomeLayout'
import Landing from '@/pages/Landing'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: <Register />
        }
      ]
    },
    {
      path: '',
      index: true,
      element: (
        <RegisterLayout>
          <Landing />
        </RegisterLayout>
      )
    }
  ])
  return routeElements
}
