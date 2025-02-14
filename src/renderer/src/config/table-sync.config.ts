export abstract class TableSyncConfig {
  public static readonly REMOTE_DB_TABLE_SYNC: string[] = [
    // old structure
    // 'tbl_misc',
    // 'tbl_menu',
    // 'tbl_service',
    // 'tbl_stock',
    // 'tbl_stock_active',
    // 'tbl_stock_bookmark',
    // 'tbl_stock_bookmark_group',
    // 'tbl_stock_department',
    // 'tbl_stock_division',
    // 'tbl_stock_subdepartment',
    // 'tbl_store',
    // 'tbl_user',
    // 'tbl_user_login',
    // 'tbl_user_role',
    // 'tbl_user_store',

    // table with new structure
    'tbl_stock',
    'tbl_stock_category',
    'tbl_stock_extra_price_store',
    'tbl_saldo_stock',
    'tbl_stock_bookmark',
    'tbl_stock_bookmark_group',
    'tbl_service',
    'tbl_misc',
    'tbl_advertising',
    'tbl_payment_cost',
    'tbl_payment_machine',
    'tbl_payment_machine_store',
    'tbl_payment_option',
    'tbl_payment_shortcut',
    'tbl_bundling',
    'tbl_bundling_reward',
    'tbl_bundling_category',
    'tbl_bundling_rules',
    'tbl_parameter',
    'tbl_bank',
    'tbl_account_code'
    // 'vw_payment_option_001'
  ]
}
