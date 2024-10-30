import { EnumServiceType } from 'src/helpers/enum';
import { RootEntity } from 'src/helpers/root.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
export declare class Service extends RootEntity {
    title: string;
    price: number;
    birliklar: string;
    serviceType: EnumServiceType;
    shartnoma: Shartnoma[];
}
