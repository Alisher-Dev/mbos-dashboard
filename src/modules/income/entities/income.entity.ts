import { EnumIncamIsPaid, EnumIncamTpeTranslation } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Income extends RootEntity {
  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: EnumIncamIsPaid })
  is_paid: EnumIncamIsPaid;

  @Column({
    type: 'enum',
    enum: EnumIncamTpeTranslation,
    default: EnumIncamTpeTranslation.cash,
  })
  payment_method: EnumIncamTpeTranslation;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Shartnoma, (shartnoma) => shartnoma.income, {
    onDelete: 'CASCADE',
  })
  shartnoma: Shartnoma;
}
