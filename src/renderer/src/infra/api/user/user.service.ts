import bcrypt from 'bcryptjs'
import pgConn from '@renderer/lib/pglite/pglite-connection'
import { MiscRepository } from '@renderer/domain/misc/storage/misc.repository'
import { TblUser } from '../../../domain/user/entity/user.entity'
import { UserRepository } from '@renderer/infra/storage/user/user.repository'
import { UserRoleRepository } from '@renderer/infra/storage/user/user-role.repository'
import authNetwork from '.'
import { TblUserRole } from '@renderer/domain/user/entity/user-role.entity'
import { Misc } from '@renderer/domain/misc/entity/misc.entity'
import { MembersTypes } from '@renderer/presentation/entity/membersTypes.entiy'

interface ReqLogin {
  userid: string
  password: string
  device: string
}

interface UserData {
  user: TblUser | null
  userRole: TblUserRole | null
  misc: Misc | null
}

interface ReqCreateMember {
  gender: string
  memberCode: string
  memberGetDefault: boolean
  memberGroupId: number
  memberName: string
  memberTypeId: number
  mobileNumber: string
  phoneNumber: string
}

interface SearchMemberResponse {
  success: boolean
  message: string
  data: [
    {
      phoneNumber: string
      memberName: string
      id: string
      memberTypeId: number
      memberGroupId: number
      memberCode: string
    }
  ]
}

interface CreateMemberResponse {
  id: string
  memberCode: string
  memberName: string
  memberGroupId: number
  memberTypeId: number
  balanceId?: number
  idType: string
  idNo: string
  address01: string
  address02: string
  cityId?: number
  state: string
  zipCode: string
  mobileNumber: string
  phoneNumber: string
  email: string
  birthDate?: string
  gender: string
  taxId: string
  cashback: number
  validityDate: string
  storeId: string
  oldMemberCode: string
  mobileActivate: string
  defaultMember: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
}

interface LoginResponse {
  id_token: string
  profile: {
    role: string
    store: string
    username: string
    usercompany: string
    userlogintime: string
    userid: string
    sessionid: string
    useripaddr2: string
    consignmentId: string
    permission: string
  }
  message: string
}

export class UserService {
  public async validateUserLogin(userId: string, password: string): Promise<boolean> {
    const user = await this.getUserByUserId(userId)

    if (!user) {
      throw new Error('User not found')
    }

    // password verification useing hash + salt
    const { hash, salt } = user
    const hashedPassword = bcrypt.hashSync(password + salt)

    if (hashedPassword === hash) {
      return true
    }

    return false
  }

  public async getUserByUserId(userId: string): Promise<TblUser | null> {
    const pg = await pgConn()
    const userRepository = new UserRepository(pg)
    const user = await userRepository.getUserByUserId(userId)
    return user
  }

  public async getUserDataByUserId(userId: string): Promise<UserData> {
    const pg = await pgConn()
    const userRepository = new UserRepository(pg)
    const userRoleRepository = new UserRoleRepository(pg)
    const miscRepository = new MiscRepository(pg)

    const user = await userRepository.getUserByUserId(userId)
    const userRole = await userRoleRepository.getUserRoleByUserId(userId)
    const misc = await miscRepository.getMiscUserRoleByMiscName(userRole?.userRole)

    return {
      user: user,
      userRole: userRole,
      misc: misc
    }
  }

  static async userLogin(reqLogin: ReqLogin): Promise<LoginResponse> {
    try {
      const res = await authNetwork.login(reqLogin)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return {
        id_token: '',
        profile: {
          role: '',
          store: '',
          username: '',
          usercompany: '',
          userlogintime: '',
          userid: '',
          sessionid: '',
          useripaddr2: '',
          consignmentId: '',
          permission: ''
        },
        message: (error as Error)?.message ?? 'Failed to log in user. Please try again.'
      }
    }
  }

  static async getMemberTypes(token: string): Promise<MembersTypes> {
    try {
      const res = await authNetwork.membersTypes(token)

      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error)?.message ?? 'Failed to get Member. Please try again.',
        id: 0,
        typeCode: '',
        typeName: '',
        discPct01: 0,
        discPct02: 0,
        discPct03: 0,
        discNominal: 0,
        sellPrice: '',
        distPricePercent: 0,
        showAsDiscount: 0,
        description: '',
        data: []
      }
    }
  }

  static async searchMember(query: string): Promise<SearchMemberResponse | Error> {
    try {
      const res = await authNetwork.searchMember(query)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error((error as Error)?.message ?? 'Failed to get Member. Please try again.')
    }
  }

  static async createMember(
    memberData: ReqCreateMember
  ): Promise<{ success: boolean; message: string; data: CreateMemberResponse } | Error> {
    try {
      const res = await authNetwork.createMember(memberData)

      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error((error as Error)?.message ?? 'Failed to create Member. Please try again.')
    }
  }

  static async memberCashback(
    id: string
  ): Promise<{ success: boolean; message: string; data: [] } | Error> {
    try {
      const res = await authNetwork.memberCashback(id)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error(
        (error as Error)?.message ?? 'Failed to get Member Cashback. Please try again.'
      )
    }
  }
}
