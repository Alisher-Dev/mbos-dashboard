import { EnumShartnoma, EnumShartnomaPaid, EnumShartnomeTpeTranslation } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { MonthlyFee } from 'src/modules/monthly_fee/entities/monthly_fee.entity';
import { Service } from 'src/modules/service/entities/service.entity';
import { User } from 'src/modules/user/entities/user.entity';
export declare class Shartnoma extends RootEntity {
    shartnoma_nomer: string;
    shartnoma_id: number;
    sana: Date;
    count: number;
    shartnoma_turi: EnumShartnoma;
    purchase_status: EnumShartnomaPaid;
    advancePayment: number;
    remainingPayment: number;
    paymentMethod: EnumShartnomeTpeTranslation;
    shartnoma_muddati: Date;
    texnik_muddati: Date;
    izoh: string;
    tolash_sana: string;
    user: User;
    income: Income[];
    monthlyFee: MonthlyFee[];
    service: Service;
}
