import type { PersonType } from '../types/enums'

export type RegisterGatewayRequest = {
  personType: PersonType
  name: string
  tradingName?: string
  email: string
  phone: string
  document: string
  zipCode: string
  address: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export type ConnectGatewayRequest = {
  document: string
  password: string
}

export type GatewayStatusResponse =
  | { connected: false }
  | { connected: true; gatewayEmail: string; clientCode?: string }
