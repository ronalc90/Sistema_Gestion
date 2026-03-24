import apiClient from './client'

export interface NotifyPayload {
  nombre: string
  documento: string
  telefono: string
  correo: string
  contratistaEmail: string
  contratistaRazonSocial: string
  nota: string
}

export interface NotifyResult {
  success: boolean
  whatsapp: boolean
  email: boolean
  errors: string[]
  message: string
}

export const notificationsApi = {
  notificarTrabajador: (data: NotifyPayload) =>
    apiClient.post<NotifyResult>('/notifications/trabajador', data).then(r => r.data),
}
