import { Outlet, useNavigation } from 'react-router'
import { LoadingNotice } from '@/components/LoadingNotice'

// Pathless root: hosts the pending notice for every navigation. Holds no
// session state — each page still owns its own route.
export function RootLayout() {
  const navigation = useNavigation()

  return (
    <>
      <Outlet />
      {navigation.state !== 'idle' && <LoadingNotice />}
    </>
  )
}
