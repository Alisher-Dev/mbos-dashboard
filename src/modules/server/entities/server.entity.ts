import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ServerPaid } from '../../server-paid/entities/server-paid.entity';
import { RootEntity } from 'src/helpers/root.entity';

@Entity('server')
export class Server extends RootEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  plan: string;

  @Column()
  price: number;

  @Column('date')
  date_term: Date;

  @Column({ length: 255 })
  responsible: string;

  @Column({ default: 1 })
  status: number;

  @Column({ nullable: true })
  register_id: number;

  @Column({ nullable: true })
  modify_id: number;

  @OneToMany(() => ServerPaid, (serverPaid) => serverPaid.server)
  serverPaid: ServerPaid[];
}
