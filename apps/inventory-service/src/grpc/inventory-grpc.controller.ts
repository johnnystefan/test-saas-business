import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface ProductStub {
  readonly id: string;
  readonly tenant_id: string;
  readonly name: string;
  readonly sku: string;
  readonly stock: number;
  readonly price: number;
}

interface ProductListStub {
  readonly items: ProductStub[];
}

interface SaleStub {
  readonly id: string;
  readonly product_id: string;
  readonly quantity: number;
  readonly total: number;
  readonly created_at: string;
}

@Controller()
export class InventoryGrpcController {
  private readonly logger = new Logger(InventoryGrpcController.name);

  @GrpcMethod('InventoryService', 'CreateProduct')
  createProduct(_data: unknown): ProductStub {
    this.logger.warn('InventoryService.CreateProduct not yet implemented');
    return {
      id: '',
      tenant_id: '',
      name: '',
      sku: '',
      stock: 0,
      price: 0,
    };
  }

  @GrpcMethod('InventoryService', 'ListProducts')
  listProducts(_data: unknown): ProductListStub {
    return { items: [] };
  }

  @GrpcMethod('InventoryService', 'UpdateStock')
  updateStock(_data: unknown): ProductStub {
    this.logger.warn('InventoryService.UpdateStock not yet implemented');
    return {
      id: '',
      tenant_id: '',
      name: '',
      sku: '',
      stock: 0,
      price: 0,
    };
  }

  @GrpcMethod('InventoryService', 'RecordSale')
  recordSale(_data: unknown): SaleStub {
    this.logger.warn('InventoryService.RecordSale not yet implemented');
    return {
      id: '',
      product_id: '',
      quantity: 0,
      total: 0,
      created_at: '',
    };
  }
}
