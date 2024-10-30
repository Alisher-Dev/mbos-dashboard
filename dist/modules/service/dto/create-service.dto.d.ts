import { EnumServiceType } from 'src/helpers/enum';
export declare class CreateServiceDto {
    title: string;
    price: number;
    serviceType: EnumServiceType;
    birliklar: string;
    whoCreated: string;
    whoUpdated: string;
    isDeleted: number;
}
