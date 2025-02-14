import { Row, Col, Typography, Button, Image, Carousel } from 'antd'
import { RootState } from '../../../../redux/store'
import { useSelector } from 'react-redux'
// import EmptyCart from '../../../../../../../resources/cart-outline.svg'
// import EmptyCart from '../../../../../../../resources/cart-outline.svg'
import EmptyCart from '../../../../../../../resources/cart-outline.svg'
import localStorage from '../../helper/localStorage'
import { useEffect, useState } from 'react'
import { formatRupiah, withoutFormat, IMAGEURL } from '../../helper/string'
import { StoreService, AdvertisingResponse } from '@renderer/infra/api/store/store.service'
import ProductItem from './productItem'
import '@renderer/index.css'

const { Title } = Typography

interface Category {
  id: number
  name: string
}

// interface API {
//   send: (message: string, data) => void
//   receive: (message: string, callback: (data) => void) => void
//   removeListener: (message: string, callback: (data) => void) => void
// }

interface DetailProduct {
  id: number
  type?: string
  bundleId?: number
  productId?: number
  serviceId?: number | null
  categoryCode?: string | null
  qty: number
  sellPrice: string
  distPrice01: string
  distPrice02: string
  distPrice03: string
  distPrice04: string
  distPrice05: string
  distPrice06: string
  distPrice07: string
  distPrice08: string
  distPrice09: string
  discount: string
  disc1: string
  disc2: string
  disc3: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  replaceable: boolean
  hide: boolean
  name: string
  code: string
  listCategory: Category[]
}

interface Product {
  typeProduct: 'Bundle' | 'Product'
  productListCode: string
  productListName: string
  qty: string
  price: number
  totalPrice: number
  detailProduct: DetailProduct | DetailProduct[]
}

// Array of Members
interface Member {
  id: string
  memberCode: string
  memberName: string
  memberGroupId: string
  memberSellPrice: string
  memberPendingPayment: string
  memberTypeId: string
  memberTypeName: string
  mobileNumber: string
  phoneNumber: string
  showAsDiscount: boolean
  idType: string | null
  idNo: string | null
  address01: string | null
  address02: string | null
  cityId: string | null
  gender: string
  state: string | null
  zipCode: string | null
  email: string | null
  birthDate: string | null
  cashback: string
  validityDate: string | null
  taxId: string | null
}

interface Advertising {
  id: string
  typeAds: string
  width: string
  height: string
  name: string
  image: string | string[]
  sort: string
  createdBy: string
  updatedBy: string
}

// interface AdvertisingResponse {
//   success: boolean
//   message: string
//   data: Advertising[]
// }

const CustomerView = (): JSX.Element => {
  const [products, setProducts] = useState(localStorage.getCashierTrans() || [])
  const [, setAds] = useState<Advertising[]>([]) // Use the correct type for ads
  const productList = useSelector((state: RootState) => state.cashier.productList)
  const [carouselImages, setCarouselImages] = useState<
    {
      id: string
      typeAds: string
      width: string
      height: string
      name: string
      image: string
      sort: string
      createdBy: string
      updatedBy: string
    }[]
  >([])

  const [member, setMember] = useState<Member>(localStorage.getMember()[0] || []) // I want to use it here
  // const api: API = window.api
  const calculateTotalPrice = (products: Product[]) => {
    return products.reduce((total, product) => total + parseFloat(`${product.totalPrice || 0}`), 0)
  }

  useEffect(() => {
    console.log(products, '<== products')
    if (window.api && typeof window.api.send === 'function') {
      try {
        const serializableData = JSON.parse(JSON.stringify(productList))
        window.api.send('update-products', serializableData)
      } catch (error) {
        console.error('Failed to serialize product list:', error)
      }
    }
  }, [productList])

  const totalHarga = calculateTotalPrice(products)

  useEffect(() => {
    if (window.api && typeof window.api.receive === 'function') {
      window.api.receive('product-updated', (updatedProducts) => {
        if (Array.isArray(updatedProducts)) {
          setProducts(updatedProducts)
          localStorage.setCashierTrans(updatedProducts)
        }
      })
    }
    return () => {
      if (window.api && typeof window.api.removeListener === 'function') {
        window.api.removeListener('product-updated', () => {})
      }
    }
  }, [])

  useEffect(() => {
    if (window.api && typeof window.api.receive === 'function') {
      window.api.receive('update-member', (updatedMember: unknown) => {
        const member = updatedMember as Member
        setMember(member)
        localStorage.setMember(member)
      })
    }

    return () => {
      if (window.api && typeof window.api.removeListener === 'function') {
        window.api.removeListener('product-updated', () => {})
      }
    }
  }, [])

  useEffect(() => {
    const getAdvertising = async () => {
      const response = await StoreService.listAdvertising()
      if ((response as AdvertisingResponse).data) {
        setAds(response.data)

        const extractedImages: {
          id: string
          typeAds: string
          width: string
          height: string
          name: string
          image: string
          sort: string
          createdBy: string
          updatedBy: string
        }[] = []

        response.data.forEach((ad) => {
          if (ad.typeAds === 'CUSTROLL') {
            let parsedImages: string[] = []

            if (Array.isArray(ad.image)) {
              parsedImages = ad.image
            } else if (typeof ad.image === 'string') {
              try {
                parsedImages = JSON.parse(ad.image)
              } catch (error) {
                parsedImages = [ad.image]
              }
            }

            parsedImages.forEach((imgUrl, index) => {
              extractedImages.push({
                id: `${ad.id}-${index}`,
                typeAds: ad.typeAds, // Add missing property
                width: ad.width,
                height: ad.height,
                name: ad.name, // Add missing property
                image: `${IMAGEURL}/${withoutFormat(imgUrl)}-main.jpg`,
                sort: ad.sort, // Add missing property
                createdBy: ad.createdBy, // Add missing property
                updatedBy: ad.updatedBy // Add missing property
              })
            })
          }
        })
        setCarouselImages(extractedImages)
      }
    }

    getAdvertising()
  }, [])

  return (
    <>
      <div className="p-1">
        {/* <div style={{ paddingBottom: '10px' }}>
          <img src={BannerCustomerView} alt="" style={{ width: '100%', borderRadius: '20px' }} />
        </div> */}
        <Row>
          <Col
            span={8}
            style={{
              backgroundColor: '#D3E4E8',
              padding: '12px 10px',
              borderRadius: '8px',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                background: '#FE4CA4',
                borderRadius: '8px',
                borderBottomRightRadius: '0px',
                borderBottomLeftRadius: '0px',
                padding: '16px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <Title
                  level={3}
                  style={{ margin: '0', padding: '0', fontSize: '1.5rem', color: '#fff' }}
                >
                  안녕 하세요 | Anyeonghaseo
                </Title>
                <span
                  style={{
                    margin: '0',
                    padding: '0',
                    fontSize: '1.5rem',
                    color: '#fff',
                    fontWeight: '100'
                  }}
                >
                  ({member?.memberName})
                </span>
              </div>
              <Button style={{ background: '#FFF0BD', color: '#FE4CA4' }}>
                You have {member?.cashback || 0} Coins
              </Button>
            </div>

            <div
              style={{
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: 0,
                overflow: 'hidden',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px'
              }}
            >
              <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                {products.length > 0 ? (
                  products
                    .slice()
                    .reverse()
                    .map((product, index) => (
                      <ProductItem key={product.id} product={product} index={index} />
                    ))
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#000000',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Image src={EmptyCart} style={{ opacity: 0.17, width: '75px' }} />
                    <p style={{ fontSize: '16px', marginTop: '1rem', opacity: 0.125 }}>
                      Keranjang Kosong
                    </p>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  // justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  marginTop: 'auto',
                  color: '#fff',
                  background: '#106C6B',
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#fff'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>Total Item</span>
                  <b style={{ fontSize: '32px' }}>
                    {productList.reduce((sum, item) => sum + Number(item.qty), 0)}
                  </b>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    color: '#fff',
                    background: '#106C6B',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>Total Harga</span>
                  <b style={{ fontSize: '32px' }}>Rp{formatRupiah(totalHarga)}</b>
                </div>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <Carousel autoplay style={{ marginLeft: '10px' }}>
              {carouselImages.map((ad) => (
                <div key={ad.id}>
                  <img
                    height={ad.height}
                    width={ad.width}
                    src={ad.image}
                    alt="Ad Image"
                    style={{ borderRadius: 10 }}
                  />
                </div>
              ))}
            </Carousel>
          </Col>
        </Row>
      </div>
    </>
  )
}

// const styles: Record<string, React.CSSProperties> = {
//   circle: {
//     background: '#0C5352',
//     borderRadius: '0.8em',
//     MozBorderRadius: '0.8em',
//     WebkitBorderRadius: '0.8em',
//     color: '#ffffff',
//     display: 'inline-block',
//     fontWeight: 'bold',
//     lineHeight: '1.6em',
//     marginRight: '5px',
//     textAlign: 'center',
//     width: '1.6em'
//   },
//   pStyle: {
//     margin: 0,
//     padding: 0
//   }
// }

export default CustomerView
