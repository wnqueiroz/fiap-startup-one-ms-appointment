import { AppointmentEntity } from 'src/appointments/appointment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { ServiceEntity } from './service.entity';

@Entity({
  name: 'service_periods',
})
export class ServicePeriodsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', {
    nullable: false,
  })
  idService: string;

  @ManyToOne(
    () => ServiceEntity,
    _ => _.id,
  )
  @JoinColumn({ name: 'idService' })
  service: ServiceEntity;

  @OneToMany(
    () => AppointmentEntity,
    _ => _.id,
  )
  appointments: AppointmentEntity[];

  @Column('time', {
    nullable: false,
  })
  startTime: string;

  @Column('time', {
    nullable: false,
  })
  endTime: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
