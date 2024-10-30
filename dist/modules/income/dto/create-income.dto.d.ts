import { EnumIncamIsPaid, EnumIncamTpeTranslation } from 'src/helpers/enum';
export declare class CreateIncomeDto {
    amount: number;
    payment_method: EnumIncamTpeTranslation;
    is_paid: EnumIncamIsPaid;
    shartnoma_id: number;
    description?: string;
    date: Date;
    user_id: number;
}
