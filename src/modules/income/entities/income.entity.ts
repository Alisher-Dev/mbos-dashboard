import { RootEntity } from 'src/helpers/root.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Income extends RootEntity {
  @Column({ default: 0 })
  translation_benefit: number;

  @Column({ default: 0 })
  cash_benefit: number;

  @Column({ default: 0 })
  online_benefit: number;

  @Column({ default: 0 })
  benefit: number;

  @Column({ default: 0 })
  workers_harm: number;

  @Column({ default: 0 })
  harm: number;
}
