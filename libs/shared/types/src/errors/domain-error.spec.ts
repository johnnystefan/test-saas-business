import { z } from 'zod/v4';
import { DomainError, DOMAIN_ERROR_TYPE } from './domain-error';
import { DomainValidationError } from './domain-validation.error';
import { InvalidArgumentError } from './invalid-argument.error';
import { BusinessRuleViolationError } from './business-rule-violation.error';
import { ResourceNotFoundError } from './resource-not-found.error';
import { ResourceAlreadyExistsError } from './resource-already-exists.error';
import { AuthenticationFailedError } from './authentication-failed.error';

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

    it('should have VALIDATION_ERROR code', () => {
      const err = new DomainValidationError({ message: 'invalid input' });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.VALIDATION_ERROR);
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

  describe('ResourceNotFoundError', () => {
    it('should be an instanceof DomainError', () => {
      const err = new ResourceNotFoundError({ resource: 'User', id: '123' });
      expect(err).toBeInstanceOf(DomainError);
    });

    it('should have RESOURCE_NOT_FOUND code', () => {
      const err = new ResourceNotFoundError({ resource: 'User', id: '123' });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.RESOURCE_NOT_FOUND);
    });

    it('should format message with resource and id', () => {
      const err = new ResourceNotFoundError({
        resource: 'User',
        id: 'abc-123',
      });
      expect(err.message).toBe('User not found: abc-123');
    });
  });

  describe('ResourceAlreadyExistsError', () => {
    it('should be an instanceof DomainError', () => {
      const err = new ResourceAlreadyExistsError({
        resource: 'User',
        field: 'email',
        value: 'x@x.com',
      });
      expect(err).toBeInstanceOf(DomainError);
    });

    it('should have RESOURCE_ALREADY_EXISTS code', () => {
      const err = new ResourceAlreadyExistsError({
        resource: 'User',
        field: 'email',
        value: 'x@x.com',
      });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.RESOURCE_ALREADY_EXISTS);
    });
  });

  describe('AuthenticationFailedError', () => {
    it('should be an instanceof DomainError', () => {
      const err = new AuthenticationFailedError({
        reason: 'invalid credentials',
      });
      expect(err).toBeInstanceOf(DomainError);
    });

    it('should have AUTH_AUTHENTICATION_FAILED code', () => {
      const err = new AuthenticationFailedError({
        reason: 'invalid credentials',
      });
      expect(err.code).toBe(DOMAIN_ERROR_TYPE.AUTH_AUTHENTICATION_FAILED);
    });
  });
});
