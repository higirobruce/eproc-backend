export type ContractStatus =
  | "active"
  | "on hold"
  | "terminated"
  | "completed"
  | "extended"
  | "pending"
  | "awarded"
  | "approved (hod)"
  | "approved"
  | "appoved (pm)"
  | "withdrawn";

export type PoStatus =
  | "active"
  | "on hold"
  | "terminated"
  | "completed"
  | "extended"
  | "pending"
  | "awarded";
export type RequestType = "rfq" | "rfp" | "rfi";
export type ContractType = "one time" | "framework";
export type ServiceCategory =
  | "RECRUITEMENT"
  | "TEAM BUILDING"
  | "IT SERVICES"
  | "STATIONERIES SUPPLY"
  | "REFRESHMENTS SUPPLY"
  | "PROMO MATERIALS SUPPLY"
  | "PRINTING SERVICES"
  | "MEDIA SRVICES"
  | "CLEANING SERVICES"
  | "MEDICAL INSURANCE SERVICES"
  | "GENERAL INSURANCE SERVICES"
  | "SECURITY SERVICES"
  | "CATERING SERVICES (RESTAURANTS)"
  | "HOTELS & CONFERENCES SERVICES"
  | "TRAVEL & TOUR SERVICES"
  | "DECORATION SERVICS"
  | "ENTERTAINMENT SERVICES"
  | "TRANSPORT SERVICES"
  | "GARAGE & MAINTENANCE SERVICES"
  | "GENERAL MAINTENANCE (HOUSING)";
export type UserType =
  | "DPT-USER"
  | "VENDOR"
  | "HOD"
  | "PROC-MANAGER"
  | "RISK-COM-MEMBER"
  | "BoD-MEMBER"
  | "CEO"
  | "HEAD-OF-FINANCE";
export type UserStatus =
  | "pending-approval"
  | "active"
  | "inactive"
  | "approved"
  | "";

export type DocumentLines = {
  ItemDescription: String;
  Quantity: number;
  UnitPrice: number;
  DocDate: Date;
  VatGroup: String;
};
