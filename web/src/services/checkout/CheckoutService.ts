import axios from 'axios'
import { API_URL, http } from '../http/HttpClient'
import type {
  CardCheckoutResponse,
  CreateCardRequest,
  CreatePixRequest,
  PixCheckoutResponse,
  PublicCheckoutResponse,
  SendCheckoutEmailRequest,
  SendCheckoutEmailResponse,
} from '../../types/checkout'

class CheckoutService {
  createPix(data: CreatePixRequest) {
    return http
      .post<PixCheckoutResponse>('/checkout-links/pix', data)
      .then((r) => r.data)
  }

  createCard(data: CreateCardRequest) {
    return http
      .post<CardCheckoutResponse>('/checkout-links/card', data)
      .then((r) => r.data)
  }

  getPublic(publicId: string) {
    return axios
      .get<PublicCheckoutResponse>(`${API_URL}/checkout-links/${publicId}`)
      .then((r) => r.data)
  }

  sendEmail(publicId: string, data: SendCheckoutEmailRequest) {
    return http
      .post<SendCheckoutEmailResponse>(
        `/checkout-links/${publicId}/send-email`,
        data,
      )
      .then((r) => r.data)
  }
}

export const checkoutService = new CheckoutService()
