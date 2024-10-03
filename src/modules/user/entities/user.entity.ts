import { ApiProperty } from '@nestjs/swagger';
import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends RootEntity {
  @Column()
  F_I_O: string;

  @Column()
  phone: number;

  @Column()
  adress: string;

  @OneToMany(() => Shartnoma, (shartnoma) => shartnoma.user)
  shartnome: Shartnoma[];
}
