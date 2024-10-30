import { RootEntity } from 'src/helpers/root.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
export declare class User extends RootEntity {
    F_I_O: string;
    phone: number;
    adress: string;
    balance: string;
    INN_number: string;
    shartnome: Shartnoma[];
    income: Income[];
}
