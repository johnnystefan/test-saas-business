import { z } from 'zod/v4';
import { DomainError, DOMAIN_ERROR_TYPE } from './domain-error';
import { DomainValidationError } from './domain-validation.error';
import { InvalidArgumentError } from './invalid-argument.error';
import { BusinessRuleViolationError } from './business-rule-violation.error';

describe('DomainError hierarchy', () => {
  describe('InvalidArgumentError', () => {
    it('should be an instanceof DomainError', () => {
      const err = new InvalidArgumentError({ message: 'bad arg' });
      expect(err).toBeInstanceOf(DomainError);
      expect(err).toBeInstanceOf(InvalidArgumentError);
    });

    it('should have the correct code', () => {
      const err = new InvalidArgumentError({ message: 'bad arg' });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.INVALID_ARGUMENT);
    });

    it('should carry context', () => {
      const err = new InvalidArgumentError({
        message: 'bad arg',
        context: { field: 'email' },
      });
      expect(err.context).toEqual({ field: 'email' });
    });
  });

  describe('BusinessRuleViolationError', () => {
    it('should be an instanceof DomainError', () => {
      const err = new BusinessRuleViolationError({ message: 'rule broken' });
      expect(err).toBeInstanceOf(DomainError);
    });

    it('should have the correct code', () => {
      const err = new BusinessRuleViolationError({ message: 'rule broken' });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.BUSINESS_RULE_VIOLATION);
    });
  });

  describe('DomainValidationError', () => {
    it('should be an instanceof DomainError', () => {
      const err = new DomainValidationError({ message: 'invalid input' });
      expect(err).toBeInstanceOf(DomainError);
    });

    it('should have VALIDATION code', () => {
      const err = new DomainValidationError({ message: 'invalid input' });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.VALIDATION);
    });

    it('fromZod should preserve ZodError issues in context', () => {
      const schema = z.object({ email: z.email() });
      const parsed = schema.safeParse({ email: 'not-an-email' });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const err = DomainValidationError.fromZod(parsed.error);
        expect(err).toBeInstanceOf(DomainValidationError);
        expect(err.context).toHaveProperty('issues');
        const issues = err.context['issues'] as unknown[];
        expect(issues.length).toBeGreaterThan(0);
      }
    });
  });
});
