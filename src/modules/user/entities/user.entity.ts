import { ApiProperty } from '@nestjs/swagger';
import { RootEntity } from 'src/helpers/root.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends RootEntity {
  @ApiProperty()
  @Column()
  F_I_O: string;

  @ApiProperty()
  @Column()
  phone: number;

  @ApiProperty()
  @Column()
  adress: string;
}
