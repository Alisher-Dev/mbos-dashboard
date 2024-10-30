import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
export declare class MonthlyFee extends RootEntity {
    amount: number;
    date: Date;
    paid: number;
    shartnoma: Shartnoma;
}
