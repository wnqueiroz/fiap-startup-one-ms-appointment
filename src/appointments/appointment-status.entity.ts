import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { AppointmentEntity } from './appointment.entity';

@Entity({
  name: 'appointment_status',
})
export class AppointmentStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(
    () => AppointmentEntity,
    _ => _.id,
  )
  service: AppointmentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
