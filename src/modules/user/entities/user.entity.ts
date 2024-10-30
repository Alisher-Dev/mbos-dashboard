import { ApiProperty } from '@nestjs/swagger';
import { RootEntity } from 'src/helpers/root.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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
  shartnome: Shartnoma[];

  @OneToMany(() => Income, (income) => income.user, { onDelete: 'CASCADE' })
  income: Income[];
}
