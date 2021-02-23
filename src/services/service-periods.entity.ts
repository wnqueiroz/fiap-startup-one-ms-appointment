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

import { AppointmentEntity } from '../appointments/appointment.entity';
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
    service => service.id,
  )
  @JoinColumn({ name: 'idService' })
  service: ServiceEntity;

  @OneToMany(
    () => AppointmentEntity,
    appointment => appointment.id,
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

  @Column({
    nullable: false,
    default: false,
  })
  removed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
