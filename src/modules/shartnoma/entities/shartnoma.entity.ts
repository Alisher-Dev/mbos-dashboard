import {
  EnumShartnoma,
  EnumShartnomaPaid,
  EnumShartnomeTpeTranslation,
} from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { Service } from 'src/modules/service/entities/service.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Shartnoma extends RootEntity {
  @Column()
  shartnoma_nomer: string;

  @Column({ type: 'int' })
  shartnoma_id: number;

  @Column({ type: 'date' })
  sana: Date;

  @Column()
  count: number;

  @Column({ type: 'enum', enum: EnumShartnoma, default: EnumShartnoma.one_bay })
  shartnoma_turi: EnumShartnoma;

  @Column({
    type: 'enum',
    enum: EnumShartnomaPaid,
    default: EnumShartnomaPaid.no_paid,
  })
  purchase_status: EnumShartnomaPaid;

  @Column({ type: 'bigint', default: 0 })
  advancePayment: number;

  @Column({ type: 'bigint', default: 0 })
  remainingPayment: number;

  @Column({
    type: 'enum',
    enum: EnumShartnomeTpeTranslation,
    default: EnumShartnomeTpeTranslation.cash,
  })
  paymentMethod: EnumShartnomeTpeTranslation;

  @Column({ type: 'date' })
  shartnoma_muddati: Date;

  @Column({ type: 'date' })
  texnik_muddati: Date;

  @Column({ nullable: true })
  izoh: string;

  @Column({ nullable: true })
  tolash_sana: string;

  @ManyToOne(() => User, (user) => user.shartnome, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Income, (income) => income.shartnoma, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  income: Income[];

  @ManyToOne(() => Service, (service) => service.shartnoma, {
    onDelete: 'CASCADE',
  })
  service: Service;
}
