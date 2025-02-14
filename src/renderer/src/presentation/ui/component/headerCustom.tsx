import React, { useEffect, useState } from 'react'
import { Layout, Avatar, Button, Dropdown, Menu } from 'antd'
import { UserStore } from '@renderer/domain/store/entity/store.entity'
import { requestFullScreen } from '../helper/string'
import StoreIcon from '../../../../../../resources/store-solid.svg'
import NoteIcon from '../../../../../../resources/outline-note.svg'
// import MenuIcon from '../../../../../../../resources/menu-solid.svg'
import ArrowExpand from '../../../../../../resources/arrow-expand-solid.svg'

const { Header } = Layout

interface HeaderCustomProps {
  userStore: UserStore
  onOpenLastTransaction: () => void
  listStores: UserStore[]
}

const HeaderCustom: React.FC<HeaderCustomProps> = ({
  userStore,
  onOpenLastTransaction,
  listStores
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedStore, setSelectedStore] = useState<UserStore | null>(userStore)
  const [listStore, setListStores] = useState<UserStore[]>(listStores)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(timer)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    setSelectedStore(userStore)
    setListStores(listStores)
  }, [userStore, listStores])

  const handleMenuClick = (store: UserStore) => {
    setSelectedStore(store)
  }

  const storeMenu = (
    <div
      style={{
        maxHeight: '200px',
        overflowY: 'auto',
        padding: '4px 0'
      }}
    >
      <Menu>
        {listStore.map((store) => (
          <Menu.Item
            key={store.value}
            onClick={() => handleMenuClick(store)}
            style={{
              fontWeight: selectedStore?.value === store.value ? 'bold' : 'normal',
              color: selectedStore?.value === store.value ? '#106C6B' : '#000',
              background: selectedStore?.value === store.value ? '#F3F5F6' : '#FFF'
            }}
          >
            {store.label}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  )

  return (
    <>
      <Header
        style={{
          background: '#0C5352',
          marginTop: 15,
          height: '5vh',
          width: '97.3%',
          alignSelf: 'center',
          borderTopRightRadius: 27,
          borderTopLeftRadius: 27,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 27px',
          color: '#fff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: isOnline ? '#26B613' : '#FF0000',
              borderRadius: '50%',
              display: 'inline-block'
            }}
          ></span>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div style={{ fontWeight: 'bold', fontSize: 15 }}>POS V1.1</div>

        <div>
          <span style={{ marginRight: 8 }}>
            {currentTime.toLocaleTimeString('id-ID', { hour12: false })} |
          </span>
          <span>{currentTime.toLocaleDateString('id-GB')}</span>
        </div>
      </Header>

      <div
        style={{
          display: 'flex',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#24908E',
          width: '97.3%',
          padding: '12px 16px',
          color: '#fff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* <img src={MenuIcon} style={{ width: '1.5rem' }} /> */}
        </div>
        <Dropdown overlay={storeMenu} trigger={['click']}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginRight: -100,
              cursor: 'pointer'
            }}
          >
            <Avatar
              size="small"
              src={StoreIcon}
              style={{ width: '1.5rem', backgroundColor: '#106C6B' }}
            />

            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{selectedStore?.label}</span>
          </div>
        </Dropdown>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button
            onClick={onOpenLastTransaction}
            icon={
              <img
                src={NoteIcon}
                style={{ width: '1.5rem', height: '26px', backgroundColor: 'transparent' }}
              />
            }
            style={{
              background: '#106C6B',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              borderRadius: 24
            }}
          >
            Transaction History
          </Button>
          <Button
            onClick={() => {
              const elem = document.body
              requestFullScreen(elem)
            }}
            icon={
              <img src={ArrowExpand} style={{ width: '1.5rem', backgroundColor: 'transparent' }} />
            }
            style={{
              background: '#106C6B',
              color: '#fff',
              border: 'none',
              borderRadius: 8
            }}
          />
        </div>
      </div>
    </>
  )
}

export default HeaderCustom
