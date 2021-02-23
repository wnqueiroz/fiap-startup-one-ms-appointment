// TODO: create static values for this on appointment_status table
export enum APPOINTMENT_STATUS {
  PENDING = '19091a27-77a6-42a0-915f-c5adffdd601c',
  FINISHED = 'EC89B1CA-AEA7-487C-923E-73D672D76A45',
  CANCEL_CUSTOMER = '7bb87638-25f3-4d5c-b87d-7a6147d12695',
  CANCEL_SYSTEM = 'b15b3641-8c46-494c-a501-02c2cbf8f1c1',
}

export enum KAFKA_TOPICS {
  SERVICES_CREATED = 'services.created',
  SERVICES_UPDATED = 'services.updated',
  SERVICES_DELETED = 'services.deleted',
  SERVICE_PERIODS_CREATED = 'service_periods.created',
  SERVICE_PERIODS_DELETED = 'service_periods.deleted',
}

export enum KAFKA_CLIENTS {
  SERVICES_SERVICE = 'SERVICES_SERVICE',
}
