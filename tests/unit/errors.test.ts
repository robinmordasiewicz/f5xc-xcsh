/**
 * Unit tests for error codes module
 */

import { describe, it, expect } from 'vitest';
import {
	ExitCode,
	ErrorCode,
	httpStatusToExitCode,
	httpStatusToErrorCode,
	exitCodeDescription,
	exitCodeHint,
	createStructuredError,
	formatError,
} from '../../src/errors/index.js';

describe('ExitCode', () => {
	it('should have correct values', () => {
		expect(ExitCode.Success).toBe(0);
		expect(ExitCode.GenericError).toBe(1);
		expect(ExitCode.ValidationError).toBe(2);
		expect(ExitCode.AuthError).toBe(3);
		expect(ExitCode.ConnectionError).toBe(4);
		expect(ExitCode.NotFoundError).toBe(5);
		expect(ExitCode.ConflictError).toBe(6);
		expect(ExitCode.RateLimitError).toBe(7);
		expect(ExitCode.QuotaExceeded).toBe(8);
		expect(ExitCode.FeatureNotAvailable).toBe(9);
	});
});

describe('ErrorCode', () => {
	it('should have correct string values', () => {
		expect(ErrorCode.MissingFlag).toBe('ERR_MISSING_FLAG');
		expect(ErrorCode.AuthFailed).toBe('ERR_AUTH_FAILED');
		expect(ErrorCode.NotFound).toBe('ERR_NOT_FOUND');
		expect(ErrorCode.QuotaExceeded).toBe('ERR_QUOTA_EXCEEDED');
	});
});

describe('httpStatusToExitCode', () => {
	it('should return Success for 2xx status codes', () => {
		expect(httpStatusToExitCode(200)).toBe(ExitCode.Success);
		expect(httpStatusToExitCode(201)).toBe(ExitCode.Success);
		expect(httpStatusToExitCode(204)).toBe(ExitCode.Success);
		expect(httpStatusToExitCode(299)).toBe(ExitCode.Success);
	});

	it('should return ValidationError for 400', () => {
		expect(httpStatusToExitCode(400)).toBe(ExitCode.ValidationError);
	});

	it('should return AuthError for 401 and 403', () => {
		expect(httpStatusToExitCode(401)).toBe(ExitCode.AuthError);
		expect(httpStatusToExitCode(403)).toBe(ExitCode.AuthError);
	});

	it('should return NotFoundError for 404', () => {
		expect(httpStatusToExitCode(404)).toBe(ExitCode.NotFoundError);
	});

	it('should return ConflictError for 409', () => {
		expect(httpStatusToExitCode(409)).toBe(ExitCode.ConflictError);
	});

	it('should return RateLimitError for 429', () => {
		expect(httpStatusToExitCode(429)).toBe(ExitCode.RateLimitError);
	});

	it('should return ConnectionError for 5xx status codes', () => {
		expect(httpStatusToExitCode(500)).toBe(ExitCode.ConnectionError);
		expect(httpStatusToExitCode(502)).toBe(ExitCode.ConnectionError);
		expect(httpStatusToExitCode(503)).toBe(ExitCode.ConnectionError);
		expect(httpStatusToExitCode(504)).toBe(ExitCode.ConnectionError);
	});

	it('should return GenericError for unknown status codes', () => {
		expect(httpStatusToExitCode(418)).toBe(ExitCode.GenericError);
		expect(httpStatusToExitCode(499)).toBe(ExitCode.GenericError);
	});
});

describe('httpStatusToErrorCode', () => {
	it('should map 400 to InvalidInput', () => {
		expect(httpStatusToErrorCode(400)).toBe(ErrorCode.InvalidInput);
	});

	it('should map 401 to AuthFailed', () => {
		expect(httpStatusToErrorCode(401)).toBe(ErrorCode.AuthFailed);
	});

	it('should map 403 to Forbidden', () => {
		expect(httpStatusToErrorCode(403)).toBe(ErrorCode.Forbidden);
	});

	it('should map 404 to NotFound', () => {
		expect(httpStatusToErrorCode(404)).toBe(ErrorCode.NotFound);
	});

	it('should map 409 to Conflict', () => {
		expect(httpStatusToErrorCode(409)).toBe(ErrorCode.Conflict);
	});

	it('should map 429 to RateLimit', () => {
		expect(httpStatusToErrorCode(429)).toBe(ErrorCode.RateLimit);
	});

	it('should map 5xx to ServerError', () => {
		expect(httpStatusToErrorCode(500)).toBe(ErrorCode.ServerError);
		expect(httpStatusToErrorCode(502)).toBe(ErrorCode.ServerError);
		expect(httpStatusToErrorCode(503)).toBe(ErrorCode.ServerError);
		expect(httpStatusToErrorCode(504)).toBe(ErrorCode.ServerError);
	});

	it('should map unknown codes to OperationFailed', () => {
		expect(httpStatusToErrorCode(418)).toBe(ErrorCode.OperationFailed);
	});
});

describe('exitCodeDescription', () => {
	it('should return correct descriptions', () => {
		expect(exitCodeDescription(ExitCode.Success)).toBe('Success');
		expect(exitCodeDescription(ExitCode.AuthError)).toBe('Authentication or authorization failure');
		expect(exitCodeDescription(ExitCode.NotFoundError)).toBe('Resource not found');
		expect(exitCodeDescription(ExitCode.QuotaExceeded)).toBe('Subscription quota exceeded');
	});
});

describe('exitCodeHint', () => {
	it('should return empty string for Success', () => {
		expect(exitCodeHint(ExitCode.Success)).toBe('');
	});

	it('should return helpful hints for error codes', () => {
		expect(exitCodeHint(ExitCode.AuthError)).toContain('credentials');
		expect(exitCodeHint(ExitCode.NotFoundError)).toContain('resource');
		expect(exitCodeHint(ExitCode.QuotaExceeded)).toContain('quota');
	});
});

describe('createStructuredError', () => {
	it('should create structured error from HTTP status', () => {
		const error = createStructuredError(404, 'Resource not found');

		expect(error.code).toBe(ErrorCode.NotFound);
		expect(error.exitCode).toBe(ExitCode.NotFoundError);
		expect(error.message).toBe('Resource not found');
		expect(error.hint).toBeDefined();
	});

	it('should include details when provided', () => {
		const error = createStructuredError(400, 'Validation failed', {
			field: 'name',
			reason: 'required',
		});

		expect(error.details).toEqual({
			field: 'name',
			reason: 'required',
		});
	});
});

describe('formatError', () => {
	it('should format error with code and message', () => {
		const error = createStructuredError(401, 'Authentication required');
		const lines = formatError(error);

		expect(lines.length).toBeGreaterThanOrEqual(1);
		expect(lines[0]).toContain('ERR_AUTH_FAILED');
		expect(lines[0]).toContain('Authentication required');
	});

	it('should include hint when available', () => {
		const error = createStructuredError(404, 'Not found');
		const lines = formatError(error);

		expect(lines.some((l) => l.startsWith('Hint:'))).toBe(true);
	});
});
