/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { PGliteProvider } from '@electric-sql/pglite-react'
import { Layout, Menu, theme } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'

const { Sider, Content, Footer } = Layout

import pgConn from './lib/pglite/pglite-connection'
import { LoginPage } from './presentation/ui/pages/login/index'
import { startSync } from './db/electric/sync'
import { migrate } from './db/electric/migration'
import LogoutPage from './presentation/ui/pages/logout'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import { setLogout } from './redux/store/slices/authSlice'
import HeaderCustom from './presentation/ui/component/headerCustom'
import CashierPage from './presentation/ui/pages/cashier'
import { setListStore, setUserStore } from './redux/store/slices/storeSlice'
import { getPaymentShortcut } from './redux/store/slices/shortcutSlice'
import { setTranscationHistory } from './redux/store/slices/cashierSlice'
import { getStores, getUserStores } from './presentation/ui/helper/userHelper'
import {
  fetchPaymentCosts,
  fetchPaymentMachine,
  fetchPaymentShortcut,
  getAvailablePaymentType
} from './redux/store/slices/paymentSlice'
import CustomerView from './presentation/ui/pages/customerView'
import { PGliteInterface } from '@electric-sql/pglite'
import { UserStore } from './domain/store/entity/store.entity'
// import { Repl } from '@electric-sql/pglite-repl'

const db: PGliteInterface = await pgConn()
await migrate(db)
await startSync(db)

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get('pos_v2') // Pastikan token login tersedia

  const location = useLocation()

  if (!token) {
    // Jika token tidak ada,
    //  arahkan ke halaman login
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

function App(): JSX.Element {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const userAccount = Cookies.get('pos_acc_v2')
  const user = userAccount ? JSON.parse(userAccount) : ''

  const dispatch = useDispatch<AppDispatch>()
  const { userStore, listStores } = useSelector((state: RootState) => state.mainStoreReducer)

  const [showSidebar, setShowSidebar] = useState(false)

  const menus = [
    { key: '1', label: 'POS', path: 'kasir', icon: <UserOutlined /> },
    { key: '2', label: 'Logout', path: 'logout', icon: <LogoutOutlined /> }
  ]

  const routes = [
    { path: '/', element: <LoginPage /> },
    { path: '/kasir', element: <CashierPage /> },
    { path: '/logout', element: <LogoutPage /> },
    { path: '/customer-view', element: <CustomerView /> }
  ]

  const handleMenuClick = (menu: { key: string; label: string }) => {
    if (menu.label.toLowerCase() === 'logout') {
      dispatch(setLogout(true))
    } else {
      dispatch(setLogout(false))
    }
  }

  const isCustomerView =
    window.location.pathname === '/customer-view' ||
    window.location.hash.includes('#/customer-view')

  if (isCustomerView) {
    return (
      <PGliteProvider db={db}>
        <CustomerView />
      </PGliteProvider>
    )
  }

  useEffect(() => {
    // Update showSidebar berdasarkan location.pathname
    if (location.pathname) {
      setShowSidebar(location.pathname === '/')
    } else {
      setShowSidebar(true)
    }
  }, [location])

  useEffect(() => {
    fetchApi()
  }, [dispatch])

  async function fetchApi() {
    try {
      if (user) {
        const listStore: UserStore[] | null = getStores()
        if (listStore) {
          const userStore = getUserStores(user.userStore)

          if (userStore) {
            dispatch(setUserStore(userStore))
          }
          dispatch(fetchPaymentShortcut(db))
          dispatch(setListStore(listStore))
          dispatch(getPaymentShortcut(db, 1))
          dispatch(getAvailablePaymentType(db))
          dispatch(fetchPaymentCosts(db, parseInt(user.userStore)))
          dispatch(fetchPaymentMachine(db, parseInt(user.userStore)))
        }
      }
    } catch (error) {
      console.error('Error fetching store data:', error)
    }
  }

  function openLastTransaction() {
    dispatch(setTranscationHistory(true))
  }

  // return (
  //   <div style={{ padding: '20px' }}>
  //     <Repl pg={db} theme={'dark'} />
  //   </div>
  // )

  return (
    <PGliteProvider db={db}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Layout Content */}
        <Layout style={{ display: 'flex' }}>
          {/* Sidebar */}
          {/* {!showSidebar && (
            <Sider
              // trigger={null}
              collapsible
              width={200}
              theme="dark"
              style={{ minHeight: '70vh' }}
            >
              <div className="demo-logo-vertical" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {menus.map((menu) => (
                  <Menu.Item key={menu.key} icon={menu.icon} onClick={() => handleMenuClick(menu)}>
                    {menu.label.toLowerCase() === 'logout' ? (
                      <Link to={menu.path}>{menu.label}</Link>
                    ) : (
                      <Link to={menu.path}>{menu.label}</Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>
          )} */}

          {/* Main Content */}
          <Layout
            style={{
              flex: 1,
              background: '#106C6B'
            }}
          >
            {!showSidebar && (
              <HeaderCustom
                userStore={userStore}
                listStores={listStores}
                onOpenLastTransaction={openLastTransaction}
              />
            )}
            <Content
              style={{
                margin: '0px 16px',
                // margin: '24px 16px',
                alignSelf: 'center',
                width: '97.3%',
                // padding: 24,
                minHeight: 280,
                background: colorBgContainer
                // borderRadius: borderRadiusLG
              }}
            >
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      route.path === '/kasir' ? (
                        <ProtectedRoute>{route.element}</ProtectedRoute>
                      ) : (
                        route.element
                      )
                    }
                  />
                ))}
              </Routes>
            </Content>

            {/* Footer */}
            {showSidebar && (
              <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
              </Footer>
            )}
          </Layout>
        </Layout>
      </Layout>
    </PGliteProvider>
  )
}

export default App
