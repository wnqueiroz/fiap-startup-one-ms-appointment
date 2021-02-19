import { AppointmentEntity } from 'src/appointments/appointment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

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
  })
  removed: boolean;

  @ManyToOne(
    () => AppointmentEntity,
    _ => _.id,
  )
  appointments: AppointmentEntity[];

  @OneToMany(
    () => ServicePeriodsEntity,
    _ => _.service,
  )
  servicePeriods: ServicePeriodsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
