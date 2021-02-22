import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

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
  })
  idAppointmentStatus: string;

  @Column('timestamp', { nullable: false })
  date: Date;

  @ManyToOne(
    () => ServiceEntity,
    _ => _.id,
  )
  @JoinColumn({ name: 'idService' })
  service: ServiceEntity;

  @ManyToOne(
    () => ServicePeriodsEntity,
    _ => _.id,
  )
  @JoinColumn({ name: 'idServicePeriod' })
  period: ServicePeriodsEntity;

  @ManyToOne(
    () => AppointmentStatusEntity,
    _ => _.id,
  )
  @JoinColumn({ name: 'idAppointmentStatus' })
  status: AppointmentStatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
