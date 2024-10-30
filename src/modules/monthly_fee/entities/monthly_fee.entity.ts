import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class MonthlyFee extends RootEntity {
  @Column({ type: 'numeric' })
  amount: number;

  @Column()
  date: Date;

  @Column({ default: 0 })
  paid: number;

  @ManyToOne(() => Shartnoma, (shartnoma) => shartnoma.monthlyFee)
  shartnoma: Shartnoma;
}
