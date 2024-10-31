import { EnumShartnomaPaid } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { MonthlyFee } from 'src/modules/monthly_fee/entities/monthly_fee.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class BalanceHistory extends RootEntity {
  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: EnumShartnomaPaid,
    nullable: true,
  })
  purchase_status: EnumShartnomaPaid;

  @ManyToOne(() => User, (user) => user.balance_history)
  @JoinColumn()
  user: User;

  @ManyToOne(() => MonthlyFee, (monthly_fee) => monthly_fee.balance_history)
  monthly_fee: MonthlyFee;
}
