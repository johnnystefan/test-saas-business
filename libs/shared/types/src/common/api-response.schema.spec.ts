import { z } from 'zod/v4';
import {
  apiResponseSchema,
  paginatedResponseSchema,
} from './api-response.schema';

describe('apiResponseSchema', () => {
  it('should return correct shape with a string data schema', () => {
    const schema = apiResponseSchema(z.string());
    const result = schema.safeParse({ data: 'hello', message: 'OK' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data).toBe('hello');
      expect(result.data.message).toBe('OK');
    }
  });

  it('should fail when data type does not match', () => {
    const schema = apiResponseSchema(z.number());
    const result = schema.safeParse({ data: 'not-a-number', message: 'OK' });
    expect(result.success).toBe(false);
  });

  it('should fail when message is missing', () => {
    const schema = apiResponseSchema(z.string());
    const result = schema.safeParse({ data: 'hello' });
    expect(result.success).toBe(false);
  });
});

describe('paginatedResponseSchema', () => {
  it('should return correct shape with a number item schema', () => {
    const schema = paginatedResponseSchema(z.number());
    const result = schema.safeParse({
      data: [1, 2, 3],
      total: 3,
      page: 1,
      pageSize: 20,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.total).toBe(3);
      expect(result.data.data).toEqual([1, 2, 3]);
    }
  });

  it('should fail when total is negative', () => {
    const schema = paginatedResponseSchema(z.number());
    const result = schema.safeParse({
      data: [],
      total: -1,
      page: 1,
      pageSize: 20,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when page is 0', () => {
    const schema = paginatedResponseSchema(z.number());
    const result = schema.safeParse({
      data: [],
      total: 0,
      page: 0,
      pageSize: 20,
    });
    expect(result.success).toBe(false);
  });
});
