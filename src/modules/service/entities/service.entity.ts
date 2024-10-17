import { EnumServiceType } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Service extends RootEntity {
  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  dona: string;

  @Column({ nullable: true })
  marta: string;

  @Column({ enum: EnumServiceType, type: 'enum' })
  serviceType: EnumServiceType;

  @OneToMany(() => Shartnoma, (shartnoma) => shartnoma.service, {
    onDelete: 'CASCADE',
  })
  shartnoma: Shartnoma[];
}
