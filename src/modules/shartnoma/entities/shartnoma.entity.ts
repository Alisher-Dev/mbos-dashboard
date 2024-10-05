import { EnumShartnoma, EnumShartnomaPaid } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Shartnoma extends RootEntity {
  @Column()
  shartnoma_id: string;

  @Column({ type: 'date' })
  sana: Date;

  @Column()
  price: string;

  @Column()
  count: number;

  @Column()
  total_price: string;

  @Column({ nullable: true })
  tolash_sana: string;

  @Column()
  service: string;

  @Column({
    type: 'enum',
    enum: EnumShartnomaPaid,
    default: EnumShartnomaPaid.no_paid,
  })
  purchase_status: EnumShartnomaPaid;

  @Column({ type: 'enum', enum: EnumShartnoma, default: EnumShartnoma.one_bay })
  shartnoma_turi: EnumShartnoma;

  @Column({ type: 'date' })
  shartnoma_muddati: Date;

  @Column({ type: 'date' })
  texnik_muddati: Date;

  @Column({ nullable: true })
  izoh: string;

  @ManyToOne(() => User, (user) => user.shartnome, { onDelete: 'CASCADE' })
  user: User;
}
