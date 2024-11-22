import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Server } from '../../server/entities/server.entity';
import { RootEntity } from 'src/helpers/root.entity';

@Entity('server_paid')
export class ServerPaid extends RootEntity {
  @ManyToOne(() => Server, (server) => server.serverPaid)
  server: Server;

  @Column()
  price: number;

  @Column('date', { nullable: true })
  date_term: Date;

  @Column({ length: 255, nullable: true })
  ads: string;

  @Column({ nullable: true })
  status: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  register_id: number;

  @Column({ nullable: true })
  modify_id: number;
}
