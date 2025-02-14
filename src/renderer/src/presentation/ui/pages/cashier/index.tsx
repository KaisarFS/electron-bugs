import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Form, Modal, message } from 'antd'
import { AppDispatch, RootState } from '@renderer/redux/store'
import { usePGlite } from '@electric-sql/pglite-react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import ProductTotal from '../../component/cashier/productTotal'
import ButtonAccess from '../../component/cashier/buttonAccess'
import RightContent from '../../component/cashier/rightContent'
import Member from '../../component/shortcut/member'
import PaymentPage from '../payment'
import {
  getBundling,
  getProductsAll,
  getServices,
  setMemberVisible,
  setBundlingVisible,
  setConsignment,
  setConsignmentVisible,
  setProductsVisible,
  setServiceVisible,
  getBookmarkGroup,
  setBookmarkGroupVisible,
  getBookmark,
  setBookmarkVisible,
  setPaymentVisible,
  setPettyCashVisible,
  setVoidVisible,
  setVoucherVisible,
  getPaymentShortcut,
  openModalWithPettyCash,
  submitPettyCash,
  setEDCVisible,
  setGrabMartVisible,
  handlePostGrabMartInvoice
} from '@renderer/redux/store/slices/shortcutSlice'
import Product from '../../component/shortcut/product'
import Service from '../../component/shortcut/service'
import { ConsignmentService } from '@renderer/infra/api/consignment/consignment.service'
import Consignments from '../../component/shortcut/consignment'
import Bundling from '../../component/shortcut/bundling'
import {
  ProductList,
  clearErrorMessage,
  deleteItem,
  fetchProductQuery,
  setChooseCategoryVisible,
  setClearProductList,
  setItemDetailVisible,
  setProductList,
  setProductQuery,
  setTranscationHistory,
  updateItem,
  updateListCategoryInDetailProduct
} from '@renderer/redux/store/slices/cashierSlice'
import BookmarkGroup from '../../component/shortcut/bookmarkGroup'
import BookmarkDetail from '../../component/shortcut/bookmarkDetail'
import PettyCash from '../../component/shortcut/pettyCash'
import Voucher from '../../component/shortcut/voucher'
import Void from '../../component/shortcut/void'
import { requestFullScreen } from '../../helper/string'
import { logout, setLogout, setUserData } from '@renderer/redux/store/slices/authSlice'
import ItemDetail from '../../component/cashier/itemDetail'
import ChooseCategory from '../../component/shortcut/chooseCategory'
import TransactionsHistory from '../../component/cashier/transactionHistory'
import { generateId } from '@renderer/utils/crypt'
import { createTransaction, fetchPaymentOptions } from '@renderer/redux/store/slices/paymentSlice'
import { validateVoucher } from '@renderer/redux/store/slices/voucherSlice'
import { authenticateUser } from '@renderer/lib/util/void.util'
import { getMember, getUserStores } from '../../helper/userHelper'
import EDC from '../../component/shortcut/edc'
import moment from 'moment'
import localStorage from '../../helper/localStorage'
import { CategoryValue, SelectedCategory } from '@renderer/presentation/entity/categoryValue.entity'
import { Products } from '@renderer/presentation/entity/product.entity'
import { AllValues } from '@renderer/presentation/entity/itemDetail.entity'
import { ConsignmentResponse } from '@renderer/presentation/entity/consignment.entity'
import { TblStockBookmarkGroup } from '@renderer/domain/stock/entity/stock-bookmark-group.entity'
import { TblBundling } from '@renderer/domain/bundling/entity/bundling.entity'
import GrabMartInvoice from '../../component/shortcut/grabMartInvoice'

const CashierPage = (): JSX.Element => {
  const navigate = useNavigate()
  const db = usePGlite()
  const userAccount = Cookies.get('pos_acc_v2') ?? ''
  const user = JSON.parse(userAccount)
  const dispatch = useDispatch<AppDispatch>()
  const { payShortcut } = useSelector((state: RootState) => state.payment)
  const { vouchers } = useSelector((state: RootState) => state.voucher)
  const { userData, isLogout } = useSelector((state: RootState) => state.authentication)
  const {
    productList,
    productListCategory,
    isModalItemDetailVisible,
    isModalQuantityVisible,
    isModalChooseCategoryVisible,
    isModalTransactionHistoryVisible,
    indexItem,
    transactionHistory,
    paymentShortcut,
    errorMessage
  } = useSelector((state: RootState) => state.cashier)
  const {
    isModalPaymentVisible,
    isModalMemberVisible,
    isModalProductVisible,
    isModalServiceVisible,
    isModalConsignmentVisible,
    isModalBundlingVisible,
    isModalBookmarkGroupVisible,
    isModalBookmarkVisible,
    isModalPettyCashVisible,
    isModalVoucherVisible,
    isModalVoidVisible,
    isModalEDCVisible,
    isModalGrabMartVisible,
    products,
    services,
    consignment,
    consignmentPagination,
    bundling,
    bookmarkGroup,
    bookmark,
    grabMartOrder
  } = useSelector((state: RootState) => state.shortcut)
  const [form] = Form.useForm()

  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const hasFetchedMember = useRef(false)
  const isProduction = process.env.NODE_ENV === 'production'

  useEffect(() => {
    if (!hasFetchedMember.current) {
      getMember(dispatch, 'UMUM')
      hasFetchedMember.current = true
    }
  }, [])

  useEffect(() => {
    fetchApi()
  }, [dispatch, db])

  async function fetchApi() {
    dispatch(getBundling(db, user.userStore, true))
    dispatch(getBookmarkGroup(db))
    dispatch(
      setUserData({
        token: user.token,
        userRole: user.userRole,
        userStore: user.userStore,
        userName: user.userName,
        userCompany: user.userCompany,
        userLoginTime: user.userLoginTime,
        userId: user.userId,
        sessionId: user.sessionId,
        userIp: user.userIp,
        consignmentId: user.consignmentId,
        permission: user.permission
      })
    )
    dispatch(fetchPaymentOptions(db))
  }

  useEffect(() => {
    if (isModalProductVisible) {
      dispatch(getProductsAll(db, user.userStore))
    }
    if (isModalServiceVisible) {
      dispatch(getServices(db))
    }
    if (isModalConsignmentVisible) {
      handleGetConsignmentStock(1, '')
    }
    if (isModalBundlingVisible) {
      dispatch(getBundling(db, user.userStore, false))
    }
    if (isModalBookmarkGroupVisible) {
      dispatch(getBookmarkGroup(db))
    }
    // if (isModalItemDetailVisible) {

    // }
    const endpoint = generateId(16)
    const transType = 'hris'
    const validationType = 'login'
    const id = 'web'

    if (isModalPettyCashVisible) {
      message.info('Buka aplikasi Fingerprint')
      dispatch(openModalWithPettyCash(user.userStore, id, endpoint, transType, validationType))

      navigator.clipboard
        .writeText(endpoint)
        .then(() => {
          message.success('Success! Key added to clipboard.')
        })
        .catch((err) => {
          message.error('Failed to copy the key to clipboard.')
          console.error(err)
        })
    }
    // if (isModalVoucherVisible) {

    // }
    // if (isModalVoidVisible) {

    // }
    if (errorMessage) {
      message.error(errorMessage)
      dispatch(clearErrorMessage())
    }
  }, [
    isModalProductVisible,
    isModalServiceVisible,
    isModalConsignmentVisible,
    isModalBundlingVisible,
    isModalBookmarkGroupVisible,
    isModalPettyCashVisible,
    isModalVoucherVisible,
    isModalVoidVisible,
    isModalEDCVisible,
    isModalItemDetailVisible,
    errorMessage
  ])

  const handleGetConsignmentStock = async (pageProps: number, search: string) => {
    const payload: { page?: number; outlet_id: number; q?: string } = {
      outlet_id: parseInt(user.consignmentId)
    }

    if (search) {
      payload.q = search
    } else {
      payload.page = pageProps ? pageProps : consignmentPagination.page
    }
    const consignmentStock = await ConsignmentService.consignmentStock(payload)
    if ((consignmentStock as unknown as ConsignmentResponse).success) {
      const paginationData = {
        page: parseInt((consignmentStock as unknown as ConsignmentResponse).page || '0'),
        // page: pageProps,
        pageSize: (consignmentStock as unknown as ConsignmentResponse).pageSize,
        total: (consignmentStock as unknown as ConsignmentResponse).total
      }
      dispatch(
        setConsignment({
          consignment: (consignmentStock as unknown as ConsignmentResponse).data,
          pagination: paginationData
        })
      )
    }
  }

  useEffect(() => {
    // Membuka modal saat pertama kali render
    modal.confirm({
      title: 'Apakah kamu yakin ingin keluar?',
      cancelText: 'Tidak',
      okText: 'Keluar',
      onOk: async () => {
        dispatch(logout())
        Cookies.remove('pos_v2')
        Cookies.remove('pos_acc_v2')
        window.location.href = '/'
      },
      onCancel: async () => {
        dispatch(setLogout(false))
        navigate('/kasir')
      }
    })
  }, [modal, isLogout])

  const openModal = (openOptions: string, index: null | number, isModalQuantityVisible = false) => {
    if (openOptions === 'payment') {
      dispatch(setPaymentVisible(true))
    }
    if (openOptions === 'itemDetail') {
      dispatch(setItemDetailVisible({ isOpen: true, indexItem: index, isModalQuantityVisible }))
    }
  }

  const handleSubmitMember = () => {
    // console.log('Form Submitted :', values)
    // Add your logic to handle the submitted data (e.g., send it to an API)
    dispatch(setMemberVisible(false))
  }

  const handleSubmitPettyCash = async (values: {
    dateTime: string
    expenseTotal: number
    discount: number
    employeeName: string
    reference: string
    description: string
    storeId: number
  }) => {
    setLoading(true)
    try {
      const storeIdData = getUserStores(user.userStore)
      console.log('object', storeIdData)

      if (!storeIdData) {
        console.error('Store ID not found or invalid, submission aborted.')
        return
      }

      const storeId = Number(storeIdData.value)
      await dispatch(
        submitPettyCash({
          dateTime: values.dateTime,
          expenseTotal: values.expenseTotal,
          discount: values.discount,
          employeeName: values.employeeName,
          reference: values.reference,
          description: values.description,
          storeId
        })
      ).unwrap()

      message.success('Petty Cash successfully submitted!')
      dispatch(setPettyCashVisible(false))
    } catch (error) {
      console.error('Error submitting petty cash:', error)
      message.error('Failed to submit petty cash. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePostGrabMart = (values: { shortOrderNumber: string }) => {
    dispatch(handlePostGrabMartInvoice(values.shortOrderNumber, user.userStore))
  }
  const handleGetVoucher = (values: { voucherCode: string }) => {
    setLoading(true)

    dispatch(validateVoucher({ voucherCode: values.voucherCode }))
      .unwrap()
      .then((data) => {
        if (!data || !data.data) {
          console.error('Invalid response structure:', data)
          return
        }

        const storedVouchers = localStorage.getVoucherList()
        const existingVouchers = storedVouchers ? JSON.parse(storedVouchers) : []

        const newVouchers = Array.isArray(data.data) ? data.data : [data.data]

        const filteredVouchers = newVouchers.filter((newVoucher) => {
          if (!newVoucher || !newVoucher.header || !newVoucher.detail) {
            console.warn('Skipping invalid voucher:', newVoucher)
            return false
          }
          const isDuplicate = existingVouchers.some(
            (existingVoucher: { generatedCode: string }) =>
              existingVoucher.generatedCode === newVoucher.detail.generatedCode
          )

          if (isDuplicate) {
            message.error('Voucher already exists')
            return
          } else {
            message.success(`Successfully added voucher: ${newVoucher.header.voucherName}`)
          }

          return true
        })

        if (filteredVouchers.length > 0) {
          const updatedVouchers = [
            ...existingVouchers,
            ...filteredVouchers.map((v) => ({
              ...v.header,
              ...v.detail
            }))
          ]

          localStorage.setVoucherList(JSON.stringify(updatedVouchers))
        } else {
          console.warn('Voucher already exists, not adding duplicate.')
        }

        form.resetFields()
      })
      .catch((error) => {
        console.error('Voucher validation failed:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // const handleDeleteConfirmation = () => {
  //   deleteEditItem(indexItem)
  // }

  const handleVoidSubmit = async (values: { userId: string; password: string; device: string }) => {
    setLoading(true)

    const allowedRoles = ['OWN', 'ITS', 'SPR', 'HFC', 'SFC', 'PCS', 'HPC', 'HKS', 'SPC']

    await authenticateUser(
      values,
      allowedRoles,
      dispatch,
      () => {
        dispatch(setClearProductList([]))
        dispatch(setVoidVisible(false))
      },
      (error) => {
        console.error('Login error:', error)
      }
    )

    window.api.send('update-products', [])
    getMember(dispatch, 'UMUM')
    form.resetFields()
    setLoading(false)
  }

  const handleEditItem = (values: AllValues) => {
    // console.log('Form Submitted :', values)

    // Kurangi values.no sebesar 1
    const updatedValues = {
      ...values,
      // qty:parseInt(values.qty),disc1: "3", disc2: "2", disc3 :"0", discount: "996",
      no: values.no - 1
    }

    // console.log('Updated Values for Dispatch:', values, productList.find((_, index) => index === values.no - 1))

    // Dispatch updated values
    dispatch(updateItem(updatedValues))
    dispatch(
      setItemDetailVisible({ isOpen: false, indexItem: null, isModalQuantityVisible: false })
    )
  }

  const handleSelectedItem = (values: Record<string, CategoryValue>) => {
    const parsedSelections = Object.keys(values).map((categoryName) => {
      const category = productListCategory.find(
        (category) => category.categoryName === categoryName
      )
      if (!category) {
        throw new Error(`Category not found: ${categoryName}`)
      }
      return {
        id: category.id,
        bundleId: category.bundleId,
        categoryName,
        categoryCode: category.categoryCode,
        selectedItem: values[categoryName]
      }
    })
    dispatch(updateListCategoryInDetailProduct(parsedSelections as unknown as SelectedCategory[]))
    dispatch(setChooseCategoryVisible(false))
  }

  const deleteEditItem = (no: number) => {
    dispatch(deleteItem(no))
    dispatch(
      setItemDetailVisible({ isOpen: false, indexItem: null, isModalQuantityVisible: false })
    )
  }

  const selectedPaymentShortcut = (paymentType: number) => {
    dispatch(getPaymentShortcut(db, paymentType))
  }

  const dataKeyboard = [
    { label: 'Orderan Online', color: '#FBF8EB', textColor: '#4B3F09', onAction: () => {} },
    {
      label: 'Product',
      color: '#F2EBFB',
      textColor: '#2D094B',
      onAction: () => dispatch(setProductsVisible(true))
    },
    {
      label: 'Bundle',
      color: '#F2EBFB',
      textColor: '#2D094B',
      onAction: () => dispatch(setBundlingVisible(true))
    },
    {
      label: 'Retail',
      color: '#EBFAFB',
      textColor: '#094B3C',
      onAction: () => selectedPaymentShortcut(1)
    },
    {
      label: 'Grabfood',
      color: '#EBFAFB',
      textColor: '#094B3C',
      onAction: () => selectedPaymentShortcut(3)
    },
    {
      label: 'F1 \nBookmark',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => dispatch(setBookmarkGroupVisible(true))
    },
    {
      label: 'F2\nKlerek',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        isProduction
          ? window.open('https://pos.k3mart.id/balance/current', '_blank')
          : window.open('http://localhost:8000/balance/current', '_blank')
      }
    },
    { label: 'F3\nReprint', color: '#FBF2EB', textColor: '#4B3F09', onAction: () => {} },
    {
      label: 'F4\nPenerimaan Barang',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        isProduction
          ? window.open('https://pos.k3mart.id/inventory/transfer/in', '_blank')
          : window.open('http://localhost:8000/inventory/transfer/in', '_blank')
      }
    },
    { label: 'QRIS', color: '#FBF8EB', textColor: '#4B3F09', onAction: () => {} },
    {
      label: 'Consignment',
      color: '#F2EBFB',
      textColor: '#2D094B',
      onAction: () => dispatch(setConsignmentVisible(true))
    },
    {
      label: 'Petty Cash',
      color: '#F2EBFB',
      textColor: '#2D094B',
      onAction: () => dispatch(setPettyCashVisible(true))
    },
    {
      label: 'Grabmart',
      color: '#EBFAFB',
      textColor: '#094B3C',
      onAction: () => {
        if (grabMartOrder.id) {
          selectedPaymentShortcut(4)
        } else {
          dispatch(setGrabMartVisible(true))
        }
      }
    },
    {
      label: 'K3express',
      color: '#EBFAFB',
      textColor: '#094B3C',
      onAction: () => selectedPaymentShortcut(8)
    },
    {
      label: 'F5\nMember',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => dispatch(setMemberVisible(true))
    },
    {
      label: 'F6\nVoucher',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => dispatch(setVoucherVisible(true))
    },
    {
      label: 'F7\nProduct Waste',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        isProduction
          ? window.open('https://pos.k3mart.id/transaction/product-waste', '_blank')
          : window.open('http://localhost:8000/transaction/product-waste', '_blank')
      }
    },
    {
      label: 'F8\nTransfer Out',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        isProduction
          ? window.open('https://pos.k3mart.id/inventory/transfer/out', '_blank')
          : window.open('http://localhost:8000/inventory/transfer/out', '_blank')
      }
    },
    {
      label: 'Customer View',
      color: '#FBF8EB',
      textColor: '#4B3F09',
      onAction: () => {
        window.electron.ipcRenderer.send('open-customer-view')
      }
    },
    {
      label: 'Services',
      color: '#F2EBFB',
      textColor: '#2D094B',
      onAction: () => dispatch(setServiceVisible(true))
    },
    {
      label: 'Void',
      color: '#F2EBFB',
      textColor: '#2D094B',
      onAction: () => dispatch(setVoidVisible(true))
    },
    {
      label: 'Gofood',
      color: '#EBFAFB',
      textColor: '#094B3C',
      onAction: () => selectedPaymentShortcut(5)
    },
    {
      label: 'EDC',
      color: '#EBFAFB',
      textColor: '#094B3C',
      onAction: () => dispatch(setEDCVisible(true))
    },
    {
      label: 'F9\nReturn to DC',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        isProduction
          ? window.open('https://pos.k3mart.id/return-to-dc', '_blank')
          : window.open('https://localhost:8000/return-to-dc', '_blank')
      }
    },
    {
      label: 'F10\nLaporan Sales',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        isProduction
          ? window.open('https://pos.k3mart.id/report/pos/summary', '_blank')
          : window.open('http://localhost:8000/report/pos/summary', '_blank')
      }
    },
    {
      label: 'F11\nFullscreen',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => {
        requestFullScreen(document.body)
      }
    },
    {
      label: 'F12\nLogout',
      color: '#FBF2EB',
      textColor: '#4B3F09',
      onAction: () => dispatch(setLogout(true))
    }
  ]

  const totalPrice = productList.reduce((acc, item) => acc + parseInt(item.totalPrice as string), 0)

  const handleNameChange = async (value: string) => {
    dispatch(fetchProductQuery(db, value, user.consignmentId))
  }

  const onRowProductClick = (record: Products) => {
    // console.log('Row clicked:', record)
    // console.log('Row index:', index)
    const productListData = [
      {
        typeProduct: 'Product',
        productListCode: record.productCode,
        productListName: record.productName,
        qty: '1',
        price: record.sellPrice,
        totalPrice: record.sellPrice,
        detailProduct: { ...record, disc1: 0, disc2: 0, disc3: 0, discount: 0 }
      }
    ]

    dispatch(
      setProductList({
        data: productListData as unknown as ProductList | ProductList[],
        canAdd: false
      })
    )
    dispatch(setProductsVisible(false))
  }

  const onRowConsignmentClick = (record: Products) => {
    // console.log('Row clicked:', record)
    // console.log('Row index:', index)

    const productListData = [
      {
        typeProduct: 'Consignment',
        productListCode: record.product.product_code,
        productListName: record.product.product_name,
        qty: '1',
        price: record.price,
        totalPrice: record.price,
        detailProduct: { ...record, disc1: 0, disc2: 0, disc3: 0, discount: 0 }
      }
    ]

    dispatch(
      setProductList({
        data: productListData as unknown as ProductList | ProductList[],
        canAdd: false
      })
    )

    dispatch(setConsignmentVisible(false))
  }

  const onRowServiceClick = (record: Products) => {
    // console.log('Row clicked:', record)
    // console.log('Row index:', index)

    const productListData = [
      {
        typeProduct: 'Service',
        productListCode: record.serviceCode,
        productListName: record.serviceName,
        qty: '1',
        price: record.serviceCost,
        totalPrice: record.serviceCost,
        detailProduct: { ...record, disc1: 0, disc2: 0, disc3: 0, discount: 0 }
      }
    ]

    dispatch(
      setProductList({
        data: productListData as unknown as ProductList | ProductList[],
        canAdd: false
      })
    )
    dispatch(setServiceVisible(false))
  }

  const onRowBundlingClick = (record: TblBundling, index: number) => {
    // console.log('Row clicked:', record)
    // console.log('Row index:', index)
    dispatch(setProductQuery(db, record.id, 'BUNDLE'))

    dispatch(getBundling(db, user.userStore, true))
    dispatch(setBundlingVisible(false))
  }

  const onRowBookmarkGroupClick = (record: TblStockBookmarkGroup, index?: number) => {
    // console.log('Row clicked:', record)
    // console.log('Row index:', index)
    dispatch(getBookmark(db, parseFloat(record.id)))

    dispatch(setBookmarkGroupVisible(false))
  }

  const onRowBookmarDetailClick = (record: Products) => {
    // console.log('Row clicked:', record)
    // console.log('Row index:', index)
    dispatch(setProductQuery(db, record.productId, record.type))

    dispatch(setBookmarkVisible(false))
  }

  const onRowPaymentClick = (values: { approvalCode: string; cardNo: string }) => {
    console.log('Row clicked:', values)
    // const usageLoyalty = localStorage.getMember()[0].useLoyalty || 0
    const usageLoyalty = 0
    const totalDiscount = usageLoyalty
    const curTotal = '0'
    const curRounding = '0'
    const listAmount: { amount: string }[] = []
    const curNetto = parseFloat(curTotal) - totalDiscount + parseFloat(curRounding) || 0
    const curTotalPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

    const payload = {
      periode: moment().format('MMYY'),
      transDate: getDate(1),
      transDate2: getDate(3),
      transTime: setTime(),
      grandTotal: totalPrice, // parseFloat(curTotal) + parseFloat(curTotalDiscount)
      totalPayment: totalPrice,
      creditCardNo: '',
      creditCardType: '',
      creditCardCharge: 0,
      curNetto,
      totalCreditCard: 0,
      transDatePrint: moment().format('DD MMM YYYY HH:mm'),
      company: [],
      // company: localStorage.getItem(`${prefix}store`)
      //   ? JSON.parse(localStorage.getItem(`${prefix}store`))
      //   : [],
      gender: localStorage.getMember() ? localStorage.getMember()[0].gender : 'No Member',
      phone: localStorage.getMember() ? localStorage.getMember()[0].phone : 'No Member',
      address: localStorage.getMember() ? localStorage.getMember()[0].address01 : 'No Member',
      // lastTransNo,
      lastTransNo: '',
      lastMeter: 0,
      // lastMeter: localStorage.getItem("lastMeter")
      //   ? JSON.parse(localStorage.getItem("lastMeter"))
      //   : 0,
      // paymentVia: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0) - (parseFloat(curTotal) + parseFloat(curRounding)) >= 0 ? 'C' : 'P',
      // paymentVia:
      //   paymentFiltered && paymentFiltered[0]
      //     ? paymentFiltered[0].typeCode
      //     : "C",
      paymentVia: 'C',
      // totalChange,
      totalChange: 0,
      // unitInfo: localStorage.getItem("memberUnit")
      //   ? JSON.parse(localStorage.getItem("memberUnit"))
      //   : {},
      unitInfo: {},
      // totalDiscount: curTotalDiscount,
      totalDiscount: 0,
      // policeNo: localStorage.getItem("memberUnit")
      //   ? JSON.parse(localStorage.getItem("memberUnit")).policeNo
      //   : null,
      policeNo: null,
      rounding: curRounding,
      memberCode: localStorage.getMember() ? localStorage.getMember()[0].id : null,
      memberId: localStorage.getMember() ? localStorage.getMember()[0].memberCode : 'No member',
      employeeName: userData ? userData.userName : 'No employee',
      memberName: localStorage.getMember() ? localStorage.getMember()[0].memberName : 'No member',
      useLoyalty: localStorage.getMember() ? localStorage.getMember()[0].useLoyalty : 0,
      // technicianId: mechanicInformation.employeeCode,
      technicianId: '',
      // curShift,
      curShift: '',
      printNo: 1,
      // curCashierNo,
      curCashierNo: '',
      cashierId: userData.userId,
      userName: userData.userName,
      // taxInfo,
      taxInfo: '',
      // setting,
      setting: '',
      listAmount,
      // companyInfo,
      companyInfo: '',
      curTotalPayment,
      curPayment: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0),
      // usingWo: !(woNumber === "" || woNumber === null),
      usingWo: '',
      // woNumber: woNumber === "" ? null : woNumber,
      woNumber: ''
    }

    console.log('cek payload payment', payload)
    dispatch(createTransaction(payload))
    dispatch(setPaymentVisible(false))
  }

  const getDate = (mode: number): string => {
    const today = new Date()
    let dd: string | number = today.getDate()
    let mm: string | number = today.getMonth() + 1 // January is 0!
    const yyyy: number = today.getFullYear()

    // Ensure dd and mm are two digits
    dd = dd < 10 ? `0${dd}` : dd
    mm = mm < 10 ? `0${mm}` : mm

    if (mode === 1) {
      return `${dd}${mm}${yyyy}`
    } else if (mode === 2) {
      return `${mm}${yyyy}`
    } else if (mode === 3) {
      return `${yyyy}-${mm}-${dd}`
    }

    return `${yyyy}-${mm}-${dd}`
  }
  const checkTime = (i) => {
    if (i < 10) {
      i = `0${i}`
    } // add zero in front of numbers < 10
    return i
  }
  const setTime = () => {
    const today = new Date()
    const h = today.getHours()
    let m = today.getMinutes()
    let s = today.getSeconds()
    m = checkTime(m)
    s = checkTime(s)

    return `${h}:${m}:${s}`
  }

  // console.log(
  //   'cek productList',
  //   availablePaymentType,
  //   payShortcut,
  //   paymentCosts,
  //   paymentEdc,
  //   listOpts
  // )

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {/* Kolom Kiri: Input Item dan Tabel */}
        <Col xs={24} lg={17}>
          <ProductTotal
            productList={productList}
            totalPrice={(totalPrice || 0).toFixed(2)}
            handleNameChange={handleNameChange}
            openDetail={openModal}
          />

          <ButtonAccess dataKeyboard={dataKeyboard} />
        </Col>

        {/* Kolom Kanan: Subtotal dan Total */}
        <Col
          xs={24}
          lg={7}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1
          }}
        >
          <RightContent
            bookmarkGroup={bookmarkGroup}
            bundling={bundling}
            handleCheckout={openModal}
            clickBookmark={onRowBookmarkGroupClick}
            clickBundling={onRowBundlingClick}
          />
        </Col>
      </Row>

      {isModalMemberVisible && (
        <Member
          isVisible={isModalMemberVisible}
          onCancel={() => dispatch(setMemberVisible(false))}
          onSubmit={handleSubmitMember}
        />
      )}

      {isModalProductVisible && (
        <Product
          visible={isModalProductVisible}
          onClose={() => dispatch(setProductsVisible(false))}
          products={products}
          onRowClick={onRowProductClick}
        />
      )}

      {isModalConsignmentVisible && (
        <Consignments
          visible={isModalConsignmentVisible}
          onClose={() => dispatch(setConsignmentVisible(false))}
          consignment={consignment}
          consignmentPagination={consignmentPagination}
          onRowClick={onRowConsignmentClick}
          onNext={handleGetConsignmentStock}
        />
      )}

      {isModalServiceVisible && (
        <Service
          visible={isModalServiceVisible}
          onClose={() => dispatch(setServiceVisible(false))}
          services={services}
          onRowClick={onRowServiceClick}
        />
      )}

      {isModalPettyCashVisible && (
        <PettyCash
          isVisible={isModalPettyCashVisible}
          onCancel={() => dispatch(setPettyCashVisible(false))}
          onSubmit={handleSubmitPettyCash}
          loading={loading}
        />
      )}

      {isModalVoucherVisible && (
        <Voucher
          isVisible={isModalVoucherVisible}
          onCancel={() => dispatch(setVoucherVisible(false))}
          onSubmit={handleGetVoucher}
          loading={loading}
        />
      )}

      {isModalBundlingVisible && (
        <Bundling
          visible={isModalBundlingVisible}
          onClose={() => {
            dispatch(getBundling(db, user.userStore, true))
            dispatch(setBundlingVisible(false))
          }}
          bundling={bundling}
          onRowClick={onRowBundlingClick}
        />
      )}

      {isModalBookmarkGroupVisible && (
        <BookmarkGroup
          visible={isModalBookmarkGroupVisible}
          onClose={() => dispatch(setBookmarkGroupVisible(false))}
          bookmarkGroup={bookmarkGroup}
          onRowClick={onRowBookmarkGroupClick}
        />
      )}

      {isModalBookmarkVisible && (
        <BookmarkDetail
          visible={isModalBookmarkVisible}
          onClose={() => dispatch(setBookmarkVisible(false))}
          bookmark={bookmark}
          onRowClick={onRowBookmarDetailClick}
        />
      )}

      {isModalVoidVisible && (
        <Void
          isVisible={isModalVoidVisible}
          onCancel={() => dispatch(setVoidVisible(false))}
          // handleDeleteConfirmation={handleDeleteConfirmation}
          onSubmit={handleVoidSubmit}
          loading={loading}
        />
      )}

      {isModalEDCVisible && (
        <EDC
          isVisible={isModalEDCVisible}
          onCancel={() => dispatch(setEDCVisible(false))}
          payShortcut={payShortcut}
          selectedPaymentShortcut={selectedPaymentShortcut}
          payShortcutSelected={paymentShortcut}
        />
      )}

      {isModalPaymentVisible && (
        <PaymentPage
          visible={isModalPaymentVisible}
          onClose={() => dispatch(setPaymentVisible(false))}
          totalPrice={totalPrice as unknown as string}
          payShortcutSelected={paymentShortcut}
          vouchers={vouchers}
          onRowClick={onRowPaymentClick}
        />
      )}

      {isModalTransactionHistoryVisible && (
        <TransactionsHistory
          visible={isModalTransactionHistoryVisible}
          transactionHistory={transactionHistory}
          onClose={() => dispatch(setTranscationHistory(false))}
        />
      )}

      {isModalItemDetailVisible && (
        <ItemDetail
          isVisible={isModalItemDetailVisible}
          productList={productList[indexItem as unknown as string]}
          // userEmployee={user.userName}
          // productList={productList[indexItem]}
          indexItem={indexItem}
          isModalQuantityVisible={isModalQuantityVisible}
          onCancel={() =>
            dispatch(
              setItemDetailVisible({
                isOpen: false,
                indexItem: null,
                isModalQuantityVisible: false
              })
            )
          }
          onDelete={deleteEditItem}
          onSubmit={handleEditItem}
        />
      )}

      {isModalChooseCategoryVisible && (
        <ChooseCategory
          isVisible={isModalChooseCategoryVisible}
          productListCategory={productListCategory}
          onCancel={() => dispatch(setChooseCategoryVisible(false))}
          onSubmit={handleSelectedItem}
        />
      )}

      {isModalGrabMartVisible && (
        <GrabMartInvoice
          isVisible={isModalGrabMartVisible}
          onCancel={() => dispatch(setGrabMartVisible(false))}
          onSubmit={handlePostGrabMart}
          loading={loading}
        />
      )}
      {isLogout && contextHolder}
    </div>
  )
}

export default CashierPage
