import axios from 'axios'
import { API_URL } from '../http/HttpClient'

class FeesService {
  getFees(brand?: string) {
    return axios
      .get<unknown>(`${API_URL}/fees`, { params: brand ? { brand } : {} })
      .then((r) => r.data)
  }
}

export const feesService = new FeesService()
