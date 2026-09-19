import { Outlet, useNavigation } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { LoadingNotice } from '@/components/LoadingNotice'

// Pathless root: hosts the header and the pending notice for every page and
// navigation. Holds no session state — each page still owns its own route.
export function RootLayout() {
  const navigation = useNavigation()

  return (
    <>
      <AppHeader />
      <Outlet />
      {navigation.state !== 'idle' && <LoadingNotice />}
    </>
  )
}
