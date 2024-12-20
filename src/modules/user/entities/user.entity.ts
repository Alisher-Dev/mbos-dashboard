import { ApiProperty } from '@nestjs/swagger';
import { RootEntity } from 'src/helpers/root.entity';
import { BalanceHistory } from 'src/modules/balance_history/entities/balance_history.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends RootEntity {
  @Column()
  F_I_O: string;

  @Column()
  phone: number;

  @Column()
  adress: string;

  @Column({ default: '0' })
  balance: string;

  @Column({ nullable: true })
  INN_number: string;

  @OneToMany(() => Shartnoma, (shartnoma) => shartnoma.user, {
    onDelete: 'CASCADE',
  })
  shartnoma: Shartnoma[];

  @OneToMany(() => Income, (income) => income.user, { onDelete: 'CASCADE' })
  income: Income[];

  @OneToMany(() => BalanceHistory, (balance_history) => balance_history.user)
  balance_history: BalanceHistory[];
}
