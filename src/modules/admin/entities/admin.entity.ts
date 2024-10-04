import { RootEntity } from 'src/helpers/root.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Admin extends RootEntity {
  @Column()
  user_name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token: string;
}
