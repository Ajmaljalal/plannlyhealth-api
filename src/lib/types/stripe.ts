export type AccountDataType = {
  email: string,
  business_profile: {
    name: string,
    support_phone: string,
    support_url: string,
    support_email: string,
    url: string,
  },
  capabilities: {
    card_payments: { requested: boolean },
    transfers: { requested: boolean },
    card_issuing: { requested: boolean }
  },
  company: {
    name: string,
    phone: string,
    address: {
      line1: string,
      line2: string,
      city: string,
      state: string,
      postal_code: string,
      country: string,
    },
    tax_id: string,
    tax_id_registrar: string,
  },
  representative: {
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    relationship: {
      job_title: string,
      ssn_last_4: string,
      representative: boolean,
    },
    address: {
      line1: string,
      line2: string,
      city: string,
      state: string,
      postal_code: string,
      country: string,
    },
    dob: {
      day: number,
      month: number,
      year: number,
    },
    ssn_last_4: string,
  },
  settings: {
    payments: {
      statement_descriptor: string,
    },
  },
  tos_acceptance: {
    ip: string,
  },
}

export type TransferDataType = {
  amount: number,
  destinationConnectAccountId: string,
}