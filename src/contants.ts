export enum APPOINTMENT_STATUS {
  PENDING = '19091a27-77a6-42a0-915f-c5adffdd601c',
  FINISHED = 'fbb9dc19-6861-4ae7-acec-269b1e768553',
  CANCEL_CUSTOMER = '7bb87638-25f3-4d5c-b87d-7a6147d12695',
  CANCEL_SYSTEM = 'b15b3641-8c46-494c-a501-02c2cbf8f1c1',
}

export enum KAFKA_TOPICS {
  APPOINTMENTS_FINISHED = 'appointments.finished',
  APPOINTMENTS_CANCELED = 'appointments.canceled',
  SERVICES_CREATED = 'services.created',
  SERVICES_UPDATED = 'services.updated',
  SERVICES_DELETED = 'services.deleted',
  SERVICE_PERIODS_CREATED = 'service_periods.created',
  SERVICE_PERIODS_DELETED = 'service_periods.deleted',
}

export enum KAFKA_CLIENTS {
  SERVICES_SERVICE = 'SERVICES_SERVICE',
}
