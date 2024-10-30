import { EnumIncamIsPaid, EnumIncamTpeTranslation } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { User } from 'src/modules/user/entities/user.entity';
export declare class Income extends RootEntity {
    amount: number;
    date: Date;
    is_paid: EnumIncamIsPaid;
    payment_method: EnumIncamTpeTranslation;
    description: string;
    shartnoma: Shartnoma;
    user: User;
}
