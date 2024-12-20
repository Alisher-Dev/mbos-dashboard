import {
  EnumShartnoma,
  EnumShartnomaPaid,
  EnumShartnomaTpeTranslation,
} from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { MonthlyFee } from 'src/modules/monthly_fee/entities/monthly_fee.entity';
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
    enum: EnumShartnomaTpeTranslation,
    default: EnumShartnomaTpeTranslation.cash,
  })
  paymentMethod: EnumShartnomaTpeTranslation;

  @Column({ type: 'date' })
  shartnoma_muddati: Date;

  @Column({ type: 'date' })
  texnik_muddati: Date;

  @Column({ nullable: true })
  izoh: string;

  @Column({ nullable: true })
  tolash_sana: string;

  @Column({ default: 0 })
  enabled: number;

  @ManyToOne(() => User, (user) => user.shartnoma, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Income, (income) => income.shartnoma, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  income: Income[];

  @OneToMany(() => MonthlyFee, (monthlyFee) => monthlyFee.shartnoma, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  monthlyFee: MonthlyFee[];

  @ManyToOne(() => Service, (service) => service.shartnoma, {
    onDelete: 'CASCADE',
  })
  service: Service;
}
