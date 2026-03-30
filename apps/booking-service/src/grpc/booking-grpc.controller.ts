import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface BookingStub {
  id: string;
  status: string;
}

interface BookingListStub {
  items: BookingStub[];
}

interface TimeSlotStub {
  start_time: string;
  end_time: string;
  available: boolean;
}

interface AvailabilityStub {
  slots: TimeSlotStub[];
}

@Controller()
export class BookingGrpcController {
  private readonly logger = new Logger(BookingGrpcController.name);

  @GrpcMethod('BookingService', 'CreateBooking')
  createBooking(_data: unknown): BookingStub {
    this.logger.warn('BookingService.CreateBooking not yet implemented');
    return { id: '', status: 'NOT_IMPLEMENTED' };
  }

  @GrpcMethod('BookingService', 'ListBookings')
  listBookings(_data: unknown): BookingListStub {
    return { items: [] };
  }

  @GrpcMethod('BookingService', 'CancelBooking')
  cancelBooking(_data: unknown): BookingStub {
    this.logger.warn('BookingService.CancelBooking not yet implemented');
    return { id: '', status: 'NOT_IMPLEMENTED' };
  }

  @GrpcMethod('BookingService', 'GetAvailability')
  getAvailability(_data: unknown): AvailabilityStub {
    return { slots: [] };
  }
}
