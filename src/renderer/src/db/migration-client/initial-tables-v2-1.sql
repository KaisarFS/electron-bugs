CREATE TABLE IF NOT EXISTS "tbl_user" (
	id bigserial NOT NULL,
	"companyId" int8 DEFAULT '1'::bigint NOT NULL,
	"userId" varchar(15) NOT NULL,
	"mobileNumber" varchar(20) NOT NULL,
	"userName" varchar(200) NOT NULL,
	email varchar(255) NOT NULL,
	"fullName" varchar(50) DEFAULT NULL::character varying NULL,
	active bool NOT NULL,
	"isEmployee" bool NULL,
	"advancedForm" bpchar(1) DEFAULT '0'::bpchar NOT NULL,
	hash varchar(128) NOT NULL,
	salt varchar(128) NOT NULL,
	totp varchar(30) DEFAULT NULL::character varying NULL,
	mobile bool DEFAULT false NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"updatedBy" varchar(30) NOT NULL,
	CONSTRAINT "idx_27337_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_27337_email ON "tbl_user" USING btree (email);
CREATE INDEX IF NOT EXISTS "idx_27337_idx_companyId" ON "tbl_user" USING btree ("companyId");
CREATE INDEX "idx_27337_idx_userId" ON "tbl_user" USING btree ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_27337_mobileNumber" ON "tbl_user" USING btree ("mobileNumber");
CREATE UNIQUE INDEX IF NOT EXISTS idx_27337_tbl_user_email_unique ON "tbl_user" USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_27337_tbl_user_userId_unique" ON "tbl_user" USING btree ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_27337_tbl_user_userName_unique" ON "tbl_user" USING btree ("userName");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_27337_userId" ON "tbl_user" USING btree ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_27337_userName" ON "tbl_user" USING btree ("userName");

ALTER TABLE
    "tbl_user" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_user_login" (
	id bigserial NOT NULL,
	"sessionId" varchar(64) NOT NULL,
	"userId" varchar(15) NOT NULL,
	"ipAddress1" varchar(15) DEFAULT NULL::character varying NULL,
	"ipAddress2" varchar(15) DEFAULT NULL::character varying NULL,
	"role" varchar(5) DEFAULT NULL::character varying NULL,
	"storeId" int4 NULL,
	"permission" varchar(200) DEFAULT NULL::character varying NULL,
	"loginTime" timestamptz NULL,
	"logoutTime" timestamptz NULL,
	CONSTRAINT "idx_27366_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_27366_tbl_user_login_fk002 ON "tbl_user_login" USING btree ("storeId");
CREATE INDEX IF NOT EXISTS idx_27366_tbl_user_login_idx001 ON "tbl_user_login" USING btree ("userId");
CREATE INDEX IF NOT EXISTS idx_27366_tbl_user_login_idx002 ON "tbl_user_login" USING btree ("userId", "storeId");

ALTER TABLE
    "tbl_user_login" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_user_role" (
	id bigserial NOT NULL,
	"userId" varchar(15) NOT NULL,
	"userRole" varchar(5) DEFAULT NULL::character varying NULL,
	"defaultRole" bool DEFAULT false NULL,
	"createdAt" timestamptz NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"updatedBy" varchar(30) NOT NULL,
	CONSTRAINT "idx_27375_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_27375_tbl_user_id_role_unique ON "tbl_user_role" USING btree ("userId", "userRole");

ALTER TABLE
    "tbl_user_role" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_user_store" (
	id bigserial NOT NULL,
	"userId" varchar(15) NOT NULL,
	"userStoreId" int8 NULL,
	"defaultStore" bool DEFAULT false NULL,
	"createdAt" timestamptz NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"updatedBy" varchar(30) NOT NULL,
	CONSTRAINT "idx_27382_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_27382_idx_storeId" ON "tbl_user_store" USING btree ("userStoreId");
CREATE INDEX IF NOT EXISTS "idx_27382_idx_userId" ON "tbl_user_store" USING btree ("userId");
CREATE INDEX IF NOT EXISTS "idx_27382_key_userStoreId" ON "tbl_user_store" USING btree ("userStoreId");
CREATE UNIQUE INDEX IF NOT EXISTS idx_27382_tbl_store_id_role_unique ON "tbl_user_store" USING btree ("userId", "userStoreId");

ALTER TABLE
    "tbl_user_store" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_misc" (
	id bigserial NOT NULL,
	"miscCode" varchar(10) NOT NULL,
	"miscName" varchar(20) NOT NULL,
	"miscDesc" varchar(50) NOT NULL,
	"miscVariable" text NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	CONSTRAINT "idx_24901_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_24901_idx_miscName" ON "tbl_misc" USING btree ("miscName");
CREATE UNIQUE INDEX IF NOT EXISTS idx_24901_misc_unique_key ON "tbl_misc" USING btree ("miscCode", "miscName");

ALTER TABLE
    "tbl_misc" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_advertising" (
	id bigserial NOT NULL,
	"typeAds" varchar(25) NOT NULL,
	"name" varchar(255) NOT NULL,
	image varchar(255) NOT NULL,
	width varchar(25) NOT NULL,
	height varchar(25) NOT NULL,
	sort int8 DEFAULT '10'::bigint NOT NULL,
	"availableStore" varchar(255) DEFAULT NULL::character varying NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_23695_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_23695_idx_availableStore" ON "tbl_advertising" USING btree ("availableStore");
CREATE INDEX IF NOT EXISTS idx_23695_idx_sort ON "tbl_advertising" USING btree (sort);
CREATE INDEX IF NOT EXISTS idx_23695_idx_type ON "tbl_advertising" USING btree ("typeAds");

ALTER TABLE
    "tbl_advertising" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_bundling" (
	id bigserial NOT NULL,
	"isPosHighlight" bool DEFAULT false NOT NULL,
	"type" bpchar(1) NOT NULL,
	code varchar(16) NOT NULL,
	"name" varchar(60) NOT NULL,
	"bundlingCategoryId" int8 NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"startHour" time NULL,
	"endHour" time NULL,
	"availableDate" varchar(30) DEFAULT NULL::character varying NULL,
	"availableStore" varchar(255) DEFAULT NULL::character varying NULL,
	"applyMultiple" bpchar(1) DEFAULT '0'::bpchar NOT NULL,
	status bpchar(1) DEFAULT '1'::bpchar NULL,
	"minimumPayment" float8 DEFAULT 0.00 NOT NULL,
	"paymentOption" varchar(3) DEFAULT NULL::character varying NULL,
	"paymentBankId" int8 NULL,
	"grabCategoryId" int8 NULL,
	"subcategoryId" varchar(27) DEFAULT NULL::character varying NULL,
	"categoryId" varchar(27) DEFAULT NULL::character varying NULL,
	"grabCategoryName" varchar(500) DEFAULT NULL::character varying NULL,
	description text NULL,
	"activeShop" int2 DEFAULT '0'::smallint NOT NULL,
	weight varchar(20) DEFAULT NULL::character varying NULL,
	memo varchar(100) DEFAULT NULL::character varying NULL,
	"productImage" text DEFAULT '["no_image.png"]'::text NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	barcode01 varchar(50) DEFAULT NULL::character varying NULL,
	"alwaysOn" bool DEFAULT false NOT NULL,
	"buildComponent" bool DEFAULT false NOT NULL,
	"haveTargetPrice" bool DEFAULT false NOT NULL,
	"targetRetailPrice" int8 DEFAULT '0'::bigint NOT NULL,
	"targetCostPrice" int8 DEFAULT '0'::bigint NOT NULL,
	CONSTRAINT "idx_23783_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_23783_code ON "tbl_bundling" USING btree (code);
CREATE INDEX IF NOT EXISTS "idx_23783_idx_activeShop" ON "tbl_bundling" USING btree ("activeShop");
CREATE INDEX IF NOT EXISTS "idx_23783_idx_alwaysOn" ON "tbl_bundling" USING btree ("alwaysOn");
CREATE INDEX IF NOT EXISTS idx_23783_idx_barcode01 ON "tbl_bundling" USING btree (barcode01);
CREATE INDEX IF NOT EXISTS "idx_23783_idx_bundlingCategoryId" ON "tbl_bundling" USING btree ("bundlingCategoryId");
CREATE INDEX IF NOT EXISTS "idx_23783_idx_grabCategoryId" ON "tbl_bundling" USING btree ("grabCategoryId");
CREATE INDEX IF NOT EXISTS "idx_23783_idx_haveTargetPrice" ON "tbl_bundling" USING btree ("haveTargetPrice");
CREATE INDEX IF NOT EXISTS "idx_23783_idx_isPosHighlight" ON "tbl_bundling" USING btree ("isPosHighlight");

ALTER TABLE
    "tbl_bundling" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_bundling_reward" (
	id bigserial NOT NULL,
	"type" bpchar(1) NOT NULL,
	"bundleId" int8 NOT NULL,
	"productId" int8 NULL,
	"serviceId" int8 NULL,
	"categoryCode" varchar(50) DEFAULT NULL::character varying NULL,
	qty int8 DEFAULT '0'::bigint NOT NULL,
	"sellPrice" float8 DEFAULT 0.00 NOT NULL,
	"distPrice01" float8 DEFAULT 0.00 NOT NULL,
	"distPrice02" float8 DEFAULT 0.00 NOT NULL,
	"distPrice03" float8 DEFAULT 0.00 NOT NULL,
	"distPrice04" float8 DEFAULT 0.00 NOT NULL,
	"distPrice05" float8 DEFAULT 0.00 NOT NULL,
	"distPrice06" float8 DEFAULT 0.00 NOT NULL,
	"distPrice07" float8 DEFAULT 0.00 NOT NULL,
	"distPrice08" float8 DEFAULT 0.00 NOT NULL,
	"distPrice09" float8 DEFAULT 0.00 NOT NULL,
	discount float8 DEFAULT 0.00 NOT NULL,
	disc1 float8 DEFAULT 0.00 NOT NULL,
	disc2 float8 DEFAULT 0.00 NOT NULL,
	disc3 float8 DEFAULT 0.00 NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	replaceable bool DEFAULT false NOT NULL,
	hide bool DEFAULT true NOT NULL,
	CONSTRAINT "idx_23822_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_23822_fk_tbl_bundling_reward_id ON "tbl_bundling_reward" USING btree ("bundleId");
CREATE INDEX IF NOT EXISTS idx_23822_fk_tbl_bundling_reward_product ON "tbl_bundling_reward" USING btree ("productId");
CREATE INDEX IF NOT EXISTS idx_23822_fk_tbl_bundling_reward_service ON "tbl_bundling_reward" USING btree ("serviceId");
CREATE INDEX IF NOT EXISTS "idx_23822_idx_bundleId" ON "tbl_bundling_reward" USING btree ("bundleId");
CREATE INDEX IF NOT EXISTS "idx_23822_idx_categoryCode" ON "tbl_bundling_reward" USING btree ("categoryCode");
CREATE INDEX IF NOT EXISTS "idx_23822_idx_productId" ON "tbl_bundling_reward" USING btree ("productId");
CREATE INDEX IF NOT EXISTS "idx_23822_idx_serviceId" ON "tbl_bundling_reward" USING btree ("serviceId");
CREATE INDEX IF NOT EXISTS idx_23822_idx_type ON "tbl_bundling_reward" USING btree (type);

ALTER TABLE
    "tbl_bundling_reward" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_bundling_category" (
	id bigserial NOT NULL,
	"categoryName" varchar(60) NOT NULL,
	"createdBy" varchar(60) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_23813_PRIMARY" PRIMARY KEY (id)
);

ALTER TABLE
    "tbl_bundling_category" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_bundling_rules" (
	id bigserial NOT NULL,
	"type" bpchar(1) NOT NULL,
	"bundleId" int8 NOT NULL,
	"productId" int8 NULL,
	"serviceId" int8 NULL,
	qty int8 NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "idx_23848_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_23848_fk_tbl_bundling_rules_id ON "tbl_bundling_rules" USING btree ("bundleId");
CREATE INDEX IF NOT EXISTS idx_23848_fk_tbl_bundling_rules_product ON "tbl_bundling_rules" USING btree ("productId");
CREATE INDEX IF NOT EXISTS idx_23848_fk_tbl_bundling_rules_service ON "tbl_bundling_rules" USING btree ("serviceId");

ALTER TABLE
    "tbl_bundling_rules" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_parameter" (
	id bigserial NOT NULL,
	"paramCode" varchar(50) NOT NULL,
	sort int8 DEFAULT '1'::bigint NOT NULL,
	"paramDescription" varchar(255) NOT NULL,
	"paramValue" varchar(255) NOT NULL,
	"createdBy" varchar(60) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_24929_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_24929_idx_paramCode" ON "tbl_parameter" USING btree ("paramCode");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_24929_uniq_paramCode" ON "tbl_parameter" USING btree ("paramCode", sort);

ALTER TABLE
    "tbl_parameter" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_payment_cost" (
	id bigserial NOT NULL,
	"machineId" int8 NOT NULL,
	"bankId" int8 NOT NULL,
	"chargePercent" float8 DEFAULT 0.00 NOT NULL,
	"chargeNominal" float8 DEFAULT 0.00 NOT NULL,
	active int2 DEFAULT '1'::smallint NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_25109_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_25109_idx_bankId" ON "tbl_payment_cost" USING btree ("bankId");
CREATE INDEX IF NOT EXISTS "idx_25109_idx_machineId" ON "tbl_payment_cost" USING btree ("machineId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_25109_machineId" ON "tbl_payment_cost" USING btree ("machineId", "bankId");

ALTER TABLE
    "tbl_payment_cost" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_payment_machine" (
	id bigserial NOT NULL,
	"name" varchar(60) NOT NULL,
	"paymentOption" varchar(3) NOT NULL,
	"qrisImage" varchar(255) DEFAULT NULL::character varying NULL,
	"accountId" int8 NULL,
	"accountIdReal" varchar(255) DEFAULT NULL::character varying NULL,
	"accountIdUnreal" varchar(255) DEFAULT NULL::character varying NULL,
	"storeHide" varchar(255) DEFAULT NULL::character varying NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_25139_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_25139_paymentOption" ON "tbl_payment_machine" USING btree ("paymentOption");

ALTER TABLE
    "tbl_payment_machine" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_payment_machine_store" (
	id bigserial NOT NULL,
	"machineId" int8 NULL,
	"storeId" int8 NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_25153_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_25153_idx_machine_id ON "tbl_payment_machine_store" USING btree ("machineId");
CREATE INDEX IF NOT EXISTS idx_25153_idx_store_id ON "tbl_payment_machine_store" USING btree ("storeId");

ALTER TABLE
    "tbl_payment_machine_store" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_payment_option" (
	id bigserial NOT NULL,
	"parentId" int8 NULL,
	"accountId" int8 NULL,
	"typeCode" varchar(3) NOT NULL,
	"typeName" varchar(30) NOT NULL,
	description varchar(30) NOT NULL,
	status bpchar(1) DEFAULT '1'::bpchar NOT NULL,
	charge float8 DEFAULT 0.00 NOT NULL,
	"chargePercent" float8 DEFAULT 0.00 NOT NULL,
	"cashBackNominal" float8 DEFAULT 0.00 NOT NULL,
	"cashBackPercent" float8 DEFAULT 0.00 NOT NULL,
	"discNominal" float8 DEFAULT 0.00 NOT NULL,
	"discPercent" float8 DEFAULT 0.00 NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "idx_25162_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_25162_idx_typeCode" ON "tbl_payment_option" USING btree ("typeCode");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_25162_typeCode" ON "tbl_payment_option" USING btree ("typeCode");

ALTER TABLE
    "tbl_payment_option" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_payment_shortcut" (
	id bigserial NOT NULL,
	"shortcutName" varchar(20) NOT NULL,
	"groupName" varchar(20) NOT NULL,
	sort int4 NOT NULL,
	"dineInTax" int8 DEFAULT '0'::bigint NOT NULL,
	"memberId" int8 NULL,
	"sellPrice" varchar(20) DEFAULT NULL::character varying NULL,
	"typeCode" varchar(20) DEFAULT NULL::character varying NULL,
	"paymentOptionId" int8 NULL,
	machine int8 NULL,
	bank int8 NULL,
	"cardNameRequired" bool DEFAULT true NOT NULL,
	"cardNoRequired" bool DEFAULT true NOT NULL,
	"consignmentPaymentType" int4 NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_25177_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_25177_idx_sort ON "tbl_payment_shortcut" USING btree (sort);

ALTER TABLE
    "tbl_payment_shortcut" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_service" (
	id bigserial NOT NULL,
	"serviceCode" varchar(30) NOT NULL,
	"serviceName" varchar(50) NOT NULL,
	"cost" float8 DEFAULT 0.00 NOT NULL,
	"serviceCost" float8 DEFAULT 0.00 NOT NULL,
	"serviceTypeId" varchar(10) NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	active bool NULL,
	CONSTRAINT "idx_26354_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_26354_idx_serviceTypeId" ON "tbl_service" USING btree ("serviceTypeId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_26354_serviceCode" ON "tbl_service" USING btree ("serviceCode");

ALTER TABLE
    "tbl_service" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_bank" (
	id bigserial NOT NULL,
	"bankCode" varchar(60) NOT NULL,
	"bankName" varchar(60) NOT NULL,
	"chargeFee" float8 DEFAULT 0.000000 NOT NULL,
	"chargeFeePercent" float8 DEFAULT 0.000000 NOT NULL,
	status bpchar(1) DEFAULT '1'::bpchar NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "idx_23732_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_23732_bankCode" ON "tbl_bank" USING btree ("bankCode");

ALTER TABLE
    "tbl_bank" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_stock" (
	id bigserial NOT NULL,
	"productCode" varchar(30) NOT NULL,
	"productName" varchar(255) NOT NULL,
	"barCode01" varchar(20) DEFAULT NULL::character varying NULL,
	"barCode02" varchar(20) DEFAULT NULL::character varying NULL,
	"otherName01" varchar(86) DEFAULT NULL::character varying NULL,
	"otherName02" varchar(60) DEFAULT NULL::character varying NULL,
	location01 varchar(50) DEFAULT '-'::character varying NOT NULL,
	location02 varchar(50) DEFAULT '-'::character varying NOT NULL,
	"locationId" int8 NULL,
	"costPrice" int8 DEFAULT '0'::bigint NOT NULL,
	"PPN" float8 DEFAULT 0.00 NOT NULL,
	"sellPrice" float8 DEFAULT 0.00 NOT NULL,
	"sellPricePre" float8 DEFAULT 0.00 NOT NULL,
	"distPrice01" float8 DEFAULT 0.00 NOT NULL,
	"distPrice02" float8 DEFAULT 0.00 NOT NULL,
	"distPrice03" float8 DEFAULT 0.00 NOT NULL,
	"distPrice04" float8 DEFAULT 0.00 NOT NULL,
	"distPrice05" float8 DEFAULT 0.00 NOT NULL,
	"distPrice06" float8 DEFAULT 0.00 NOT NULL,
	"distPrice07" float8 DEFAULT 0.00 NOT NULL,
	"distPrice08" float8 DEFAULT 0.00 NOT NULL,
	"distPrice09" float8 DEFAULT 0.00 NOT NULL,
	"brandId" int8 NOT NULL,
	"categoryId" int8 NOT NULL,
	"supplierSource" int8 NOT NULL,
	"divisionId" int8 NOT NULL,
	"departmentId" int8 NOT NULL,
	"subdepartmentId" int8 NOT NULL,
	"supplierId" int8 NULL,
	"countryName" varchar(255) DEFAULT NULL::character varying NULL,
	"isHalal" bool DEFAULT false NOT NULL,
	"trackQty" bool DEFAULT true NULL,
	"alertQty" float8 DEFAULT 20.00 NULL,
	active bool DEFAULT true NOT NULL,
	"productTag" varchar(1) NOT NULL,
	"productBaseTag" varchar(1) NOT NULL,
	"isStockOpname" bool DEFAULT true NOT NULL,
	"stockOpnameAccount" int8 NULL,
	"isStaging" bool DEFAULT false NOT NULL,
	"taxType" bpchar(1) DEFAULT 'E'::bpchar NOT NULL,
	exception01 bool DEFAULT true NOT NULL,
	"usageTimePeriod" int8 DEFAULT '0'::bigint NULL,
	"usageMileage" int8 DEFAULT '0'::bigint NULL,
	"productImage" text DEFAULT '["no_image.png"]'::text NULL,
	description text NULL,
	dimension varchar(30) DEFAULT NULL::character varying NULL,
	"dimensionPack" varchar(25) DEFAULT NULL::character varying NULL,
	"dimensionBox" varchar(25) DEFAULT NULL::character varying NULL,
	weight varchar(20) DEFAULT NULL::character varying NULL,
	"activeShop" bool DEFAULT false NOT NULL,
	"publishDate" timestamptz NULL,
	"grabCategoryId" int8 NULL,
	"grabCategoryName" varchar(500) DEFAULT NULL::character varying NULL,
	"expressActive" bool DEFAULT false NOT NULL,
	"expressItemId" int8 NULL,
	"expressReturnPolicy" bool NULL,
	"expressCategoryId" int8 NULL,
	"expressCategoryName" varchar(255) DEFAULT NULL::character varying NULL,
	"expressBrandId" int8 NULL,
	"expressBrandName" varchar(255) DEFAULT NULL::character varying NULL,
	"expressUploaded" bpchar(1) DEFAULT 'N'::bpchar NOT NULL,
	"dummyCode" varchar(30) DEFAULT NULL::character varying NULL,
	"dummyName" varchar(255) DEFAULT NULL::character varying NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"sectionWidth" varchar(10) DEFAULT NULL::character varying NULL,
	"aspectRatio" varchar(10) DEFAULT NULL::character varying NULL,
	"rimDiameter" varchar(10) DEFAULT NULL::character varying NULL,
	"shortName" varchar(35) DEFAULT NULL::character varying NULL,
	CONSTRAINT "idx_26404_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_26404_barCode01" ON "tbl_stock" USING btree ("barCode01");
CREATE INDEX IF NOT EXISTS "idx_26404_barCode01_2" ON "tbl_stock" USING btree ("barCode01");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_departmentId" ON "tbl_stock" USING btree ("departmentId");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_divisionId" ON "tbl_stock" USING btree ("divisionId");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_expressActive" ON "tbl_stock" USING btree ("expressActive");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_expressItemId" ON "tbl_stock" USING btree ("expressItemId");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_expressUploaded" ON "tbl_stock" USING btree ("expressUploaded");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_grabCategoryId" ON "tbl_stock" USING btree ("grabCategoryId");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_isStockOpname" ON "tbl_stock" USING btree ("isStockOpname");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_locationId" ON "tbl_stock" USING btree ("locationId");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_productBaseTag" ON "tbl_stock" USING btree ("productBaseTag");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_productTag" ON "tbl_stock" USING btree ("productTag");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_stockOpnameAccount" ON "tbl_stock" USING btree ("stockOpnameAccount");
CREATE INDEX "idx_26404_idx_subdepartmentId" ON "tbl_stock" USING btree ("subdepartmentId");
CREATE INDEX IF NOT EXISTS "idx_26404_idx_supplierSource" ON "tbl_stock" USING btree ("supplierSource");
CREATE INDEX IF NOT EXISTS idx_26404_k_stock_brand ON "tbl_stock" USING btree ("brandId");
CREATE INDEX IF NOT EXISTS idx_26404_k_stock_category ON "tbl_stock" USING btree ("categoryId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_26404_productCode" ON "tbl_stock" USING btree ("productCode");
CREATE INDEX IF NOT EXISTS "idx_26404_productCode_2" ON "tbl_stock" USING btree ("productCode");
CREATE INDEX IF NOT EXISTS "idx_26404_productName" ON "tbl_stock" USING btree ("productName");
CREATE INDEX IF NOT EXISTS "idx_26404_supplierId" ON "tbl_stock" USING btree ("supplierId");

ALTER TABLE
    "tbl_stock" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_stock_category" (
	id bigserial NOT NULL,
	"categoryCode" varchar(50) NOT NULL,
	"categoryName" varchar(50) NOT NULL,
	"categoryImage" text DEFAULT '["no_image.png"]'::text NULL,
	"categoryColor" varchar(7) DEFAULT NULL::character varying NULL,
	"categoryParentId" int8 NULL,
	"categoryIcon" varchar(40) DEFAULT 'BikeIcon'::character varying NULL,
	"loyaltyException" bool DEFAULT true NOT NULL,
	"grabCategory" int8 NULL,
	"createdBy" varchar(30) NOT NULL,
	"updatedBy" varchar(30) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"commerceException" bool DEFAULT false NOT NULL,
	CONSTRAINT "idx_26501_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_26501_categoryCode" ON "tbl_stock_category" USING btree ("categoryCode");

ALTER TABLE
    "tbl_stock_category" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_saldo_stock" (
	id bigserial NOT NULL,
	"period" int4 DEFAULT 1 NOT NULL,
	"year" int4 DEFAULT 2020 NOT NULL,
	"storeId" int8 NOT NULL,
	"productCode" varchar(30) NOT NULL,
	"productName" varchar(255) NOT NULL,
	qty int8 DEFAULT '0'::bigint NOT NULL,
	amount float8 DEFAULT 0.00 NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "idx_26323_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_26323_productCode" ON "tbl_saldo_stock" USING btree ("productCode");
CREATE INDEX IF NOT EXISTS "idx_26323_storeId" ON "tbl_saldo_stock" USING btree ("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_26323_uniq_productCode" ON "tbl_saldo_stock" USING btree ("storeId", "productCode");

ALTER TABLE
    "tbl_saldo_stock" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_stock_bookmark" (
	id bigserial NOT NULL,
	"type" varchar(10) DEFAULT 'PRODUCT'::character varying NOT NULL,
	"productId" int8 NOT NULL,
	"groupId" int8 NOT NULL,
	"shortcutCode" varchar(3) DEFAULT NULL::character varying NULL,
	"bookmarkImage" varchar(255) DEFAULT NULL::character varying NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" varchar(60) DEFAULT NULL::character varying NULL,
	CONSTRAINT "idx_26473_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_26473_groupId" ON "tbl_stock_bookmark" USING btree ("groupId");
CREATE INDEX IF NOT EXISTS "idx_26473_idx_shortcutCode" ON "tbl_stock_bookmark" USING btree ("shortcutCode");
CREATE INDEX IF NOT EXISTS "idx_26473_productId" ON "tbl_stock_bookmark" USING btree ("productId");

ALTER TABLE
    "tbl_stock_bookmark" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_stock_bookmark_group" (
	id bigserial NOT NULL,
	"name" varchar(30) NOT NULL,
	"shortcutCode" varchar(3) DEFAULT NULL::character varying NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" varchar(60) DEFAULT NULL::character varying NULL,
	CONSTRAINT "idx_26485_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_26485_idx_shortcutCode" ON "tbl_stock_bookmark_group" USING btree ("shortcutCode");
CREATE INDEX IF NOT EXISTS idx_26485_name ON "tbl_stock_bookmark_group" USING btree (name);

ALTER TABLE
    "tbl_stock_bookmark_group" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_stock_brand" (
	id bigserial NOT NULL,
	"brandCode" varchar(6) NOT NULL,
	"brandName" varchar(25) NOT NULL,
	"brandImage" varchar(50) DEFAULT NULL::character varying NULL,
	"createdBy" varchar(30) NOT NULL,
	"updatedBy" varchar(30) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "idx_26495_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_26495_stock_brand_unique_key ON "tbl_stock_brand" USING btree ("brandCode");

ALTER TABLE
    "tbl_stock_brand" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_stock_extra_price_store" (
	id bigserial NOT NULL,
	"storeId" int8 NOT NULL,
	"productId" int8 NOT NULL,
	"sellPrice" float8 DEFAULT 0.00 NOT NULL,
	"distPrice01" float8 DEFAULT 0.00 NOT NULL,
	"distPrice02" float8 DEFAULT 0.00 NOT NULL,
	"distPrice03" float8 DEFAULT 0.00 NOT NULL,
	"distPrice04" float8 DEFAULT 0.00 NOT NULL,
	"distPrice05" float8 DEFAULT 0.00 NOT NULL,
	"distPrice06" float8 DEFAULT 0.00 NOT NULL,
	"distPrice07" float8 DEFAULT 0.00 NOT NULL,
	"distPrice08" float8 DEFAULT 0.00 NOT NULL,
	"distPrice09" float8 DEFAULT 0.00 NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" varchar(60) DEFAULT NULL::character varying NULL,
	CONSTRAINT "idx_26543_PRIMARY" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "idx_26543_productId" ON "tbl_stock_extra_price_store" USING btree ("productId");
CREATE INDEX IF NOT EXISTS "idx_26543_storeId" ON "tbl_stock_extra_price_store" USING btree ("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_26543_storeId_2" ON "tbl_stock_extra_price_store" USING btree ("storeId", "productId");

ALTER TABLE
    "tbl_stock_extra_price_store" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "tbl_account_code" (
	id bigserial NOT NULL,
	"accountCode" varchar(12) NOT NULL,
	"accountName" varchar(60) NOT NULL,
	"accountParentId" int8 NULL,
	"accountType" varchar(20) NOT NULL,
	"createdBy" varchar(30) NOT NULL,
	"createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" varchar(30) DEFAULT NULL::character varying NULL,
	"updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedBy" varchar(60) DEFAULT NULL::character varying NULL,
	"deletedAt" timestamptz NULL,
	CONSTRAINT "idx_23586_PRIMARY" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_23586_accountCode" ON "tbl_account_code" USING btree ("accountCode");
CREATE INDEX IF NOT EXISTS "idx_23586_idx_accountParentId" ON "tbl_account_code" USING btree ("accountParentId");
CREATE INDEX IF NOT EXISTS "idx_23586_idx_accountType" ON "tbl_account_code" USING btree ("accountType");
CREATE INDEX IF NOT EXISTS "idx_23586_idx_deletedAt" ON "tbl_account_code" USING btree ("deletedAt");

ALTER TABLE
    "tbl_account_code" OWNER TO "postgres";