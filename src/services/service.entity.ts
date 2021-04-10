import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { AppointmentEntity } from '../appointments/appointment.entity';
import { ServicePeriodsEntity } from './service-periods.entity';

@Entity({
  name: 'services',
})
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('uuid', {
    nullable: false,
  })
  idCompany: string;

  @Column({
    nullable: false,
    default: false,
  })
  removed: boolean;

  @Column({
    nullable: false,
  })
  companyName: string;

  @Column({
    nullable: false,
  })
  companyAddress: string;

  @OneToMany(
    () => AppointmentEntity,
    appointment => appointment.service,
    {
      cascade: true, // TODO: check to use onUpdate: true instead this
    },
  )
  appointments: AppointmentEntity[];

  @OneToMany(
    () => ServicePeriodsEntity,
    servicePeriod => servicePeriod.service,
    {
      cascade: true, // TODO: check to use onUpdate: true instead this
    },
  )
  servicePeriods: ServicePeriodsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
