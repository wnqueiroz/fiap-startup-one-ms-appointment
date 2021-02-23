import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { APPOINTMENT_STATUS } from '../contants';
import { ServicePeriodsEntity } from '../services/service-periods.entity';
import { ServiceEntity } from '../services/service.entity';
import { AppointmentStatusEntity } from './appointment-status.entity';

@Entity({
  name: 'appointments',
})
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', {
    nullable: false,
  })
  idUser: string;

  @Column('uuid', {
    nullable: false,
  })
  idService: string;

  @Column('uuid', {
    nullable: false,
  })
  idServicePeriod: string;

  @Column('uuid', {
    nullable: false,
    default: APPOINTMENT_STATUS.PENDING,
  })
  idAppointmentStatus: string;

  @Column('timestamp', { nullable: false })
  date: Date;

  @ManyToOne(
    () => ServiceEntity,
    service => service.id,
  )
  @JoinColumn({ name: 'idService' })
  service: ServiceEntity;

  @ManyToOne(
    () => ServicePeriodsEntity,
    servicePeriod => servicePeriod.id,
  )
  @JoinColumn({ name: 'idServicePeriod' })
  servicePeriod: ServicePeriodsEntity;

  @ManyToOne(
    () => AppointmentStatusEntity,
    appointmentStatus => appointmentStatus.id,
  )
  @JoinColumn({ name: 'idAppointmentStatus' })
  appointmentStatus: AppointmentStatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
