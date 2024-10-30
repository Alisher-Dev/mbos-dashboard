import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    find(): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findIncome(): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findStatistik(): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findServiceDash({ id }: {
        id: number;
    }): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
