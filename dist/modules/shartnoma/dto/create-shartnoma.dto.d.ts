import { EnumShartnoma, EnumShartnomaPaid, EnumShartnomeTpeTranslation } from 'src/helpers/enum';
export declare class CreateShartnomaDto {
    sana: string;
    shartnoma_nomer: string;
    whoCreated: string;
    whoUpdated: string;
    isDeleted: number;
    shartnoma_turi: EnumShartnoma;
    count: number;
    purchase_status: EnumShartnomaPaid;
    paymentMethod: EnumShartnomeTpeTranslation;
    service_id: string;
    shartnoma_muddati: string;
    user_id: string;
    texnik_muddati: string;
    tolash_sana: string;
    izoh?: string;
    advancePayment?: number;
}
