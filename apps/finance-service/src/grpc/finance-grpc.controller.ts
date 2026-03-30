import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface TransactionStub {
  id: string;
  type: string;
  amount: number;
}

interface TransactionListStub {
  items: TransactionStub[];
}

interface SummaryStub {
  total_income: number;
  total_expenses: number;
  net_balance: number;
}

@Controller()
export class FinanceGrpcController {
  private readonly logger = new Logger(FinanceGrpcController.name);

  @GrpcMethod('FinanceService', 'RecordTransaction')
  recordTransaction(_data: unknown): TransactionStub {
    this.logger.warn('FinanceService.RecordTransaction not yet implemented');
    return { id: '', type: 'NOT_IMPLEMENTED', amount: 0 };
  }

  @GrpcMethod('FinanceService', 'ListTransactions')
  listTransactions(_data: unknown): TransactionListStub {
    return { items: [] };
  }

  @GrpcMethod('FinanceService', 'GetSummary')
  getSummary(_data: unknown): SummaryStub {
    this.logger.warn('FinanceService.GetSummary not yet implemented');
    return { total_income: 0, total_expenses: 0, net_balance: 0 };
  }
}
