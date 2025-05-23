import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envConfig } from './env.config';
import { User } from 'src/modules/user/entities/user.entity';
import { Shartnoma } from 'src/modules/shartnoma/entities/shartnoma.entity';
import { Income } from 'src/modules/income/entities/income.entity';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Service } from 'src/modules/service/entities/service.entity';
import { MonthlyFee } from 'src/modules/monthly_fee/entities/monthly_fee.entity';
import { BalanceHistory } from 'src/modules/balance_history/entities/balance_history.entity';
import { Server } from 'src/modules/server/entities/server.entity';
import { ServerPaid } from 'src/modules/server-paid/entities/server-paid.entity';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envConfig.database.host,
  port: envConfig.database.port,
  username: envConfig.database.user,
  password: envConfig.database.password,
  database: envConfig.database.name,
  entities: [
    User,
    Shartnoma,
    Income,
    Admin,
    Service,
    MonthlyFee,
    BalanceHistory,
    Server,
    ServerPaid,
  ],
  synchronize: true,
};
