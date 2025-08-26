export type MetaData = {
  OFXHEADER: string;
  DATA: string;
  VERSION: string;
  SECURITY: string;
  ENCODING: string;
  CHARSET: string;
  COMPRESSION: string;
  OLDFILEUID: string;
  NEWFILEUID: string;
};
export type DateResponse = {
  datetime: string | null;
  date: string | null;
  time: string | null;
  offset: string | null;
  timezone: string | null;
};
export type ConfigDate = {
  /**
   * @description supported keys:
   *  yy => year -> 2 digits,
   *  yyyy or y => year,
   *  MM or M => month,
   *  dd or d => day,
   *  hh or h => hour,
   *  mm or m => minute,
   *  ss or s => second,
   *  O => offset,
   *  TZ => timezone
   * @example format: 'y-M-d h:m:s'
   * @returns '2022-02-21 09:00:00'
   */
  formatDate?: string;
};
export type ConfigFitId = "normal" | "separated";
export type ExtractorConfig = ConfigDate & {
  fitId?: ConfigFitId;
  nativeTypes?: boolean;
};
export type TransactionsSummary = {
  credit: number;
  debit: number;
  amountOfCredits: number;
  amountOfDebits: number;
  dateStart: string;
  dateEnd: string;
};

export type Status = {
  CODE: string;
  SEVERITY: string;
};
export type BankAccountFrom = {
  BANKID: string;
  ACCTID: string;
  ACCTT: string;
};
type TransferType = string;
export type OfxConfig = ConfigDate & {
  fitId?: ConfigFitId;
  nativeTypes?: boolean;
};
export type STRTTRN = {
  TRNTYPE: TransferType;
  DTPOSTED: DateResponse;
  TRNAMT: string;
  FITID:
    | string
    | {
        date: string;
        protocol: string;
        transactionCode: string;
      };
  CHECKNUM: string;
  MEMO: string;
};
export type BankTransferList = {
  DTSTART: DateResponse;
  DTEND: DateResponse;
  STRTTRN: STRTTRN[];
};
export type LedGerBal = {
  BALAMT: string;
  DTASOF: DateResponse;
};
export type FINANCIAL_INSTITUTION = {
  ORG: string;
  FID: string;
};
export type Bank = {
  STMTTRNRS: {
    TRNUID: number;
    STATUS: Status;
    STMTRS: {
      CURDEF: string;
      BANKACCTFROM: BankAccountFrom;
      BANKTRANLIST: BankTransferList;
      LEDGERBAL: LedGerBal;
      MKTGINFO: string;
    };
  };
};
export type CreditCard = {
  CCSTMTTRNRS: {
    TRNUID: number;
    STATUS: Status;
    CCSTMTRS: {
      CURDEF: string;
      CCACCTFROM: {
        ACCTID: string;
      };
      BANKTRANLIST: BankTransferList;
      LEDGERBAL: LedGerBal;
      MKTGINFO: string;
    };
  };
};
export type OfxStructure = {
  OFX: {
    SIGNONMSGSRSV1: {
      SONRS: {
        STATUS: Status;
        DTSERVER: DateResponse;
        LANGUAGE: string;
        DTACCTUP: DateResponse;
        FI: FINANCIAL_INSTITUTION;
      };
    };
    BANKMSGSRSV1: Bank;
    CREDITCARDMSGSRSV1: CreditCard;
  };
};
export type OfxResponse = MetaData & OfxStructure;
