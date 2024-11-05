import { RootEntity } from 'src/helpers/root.entity';
import { BalanceHistory } from 'src/modules/balance_history/entities/balance_history.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class MonthlyFee extends RootEntity {
  @Column({ type: 'numeric' })
  amount: number;

  @Column()
  date: Date;

  @Column({ default: 0 })
  paid: number;

  @Column({ nullable: true })
  commit: string;

  @ManyToOne(() => Shartnoma, (shartnoma) => shartnoma.monthlyFee)
  shartnoma: Shartnoma;

  @OneToMany(
    () => BalanceHistory,
    (balance_history) => balance_history.monthly_fee,
  )
  balance_history: BalanceHistory[];
}
