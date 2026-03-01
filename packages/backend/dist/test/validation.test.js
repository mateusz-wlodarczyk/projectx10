"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validation_1 = require("../utils/validation");
(0, vitest_1.describe)('Validation Utilities', () => {
    (0, vitest_1.describe)('Email Validation', () => {
        (0, vitest_1.it)('should validate correct email formats', () => {
            // Arrange
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.uk',
                'user+tag@example.org',
                'user123@test-domain.com',
                'a@b.c',
            ];
            // Act & Assert
            validEmails.forEach(email => {
                (0, vitest_1.expect)(validation_1.validation.isValidEmail(email)).toBe(true);
            });
        });
        (0, vitest_1.it)('should reject invalid email formats', () => {
            // Arrange
            const invalidEmails = [
                'invalid-email',
                '@example.com',
                'test@',
                'test.example.com',
                'test@.com',
                'test@example.',
                '',
                'test@example..com',
                'test@example.com.',
            ];
            // Act & Assert
            invalidEmails.forEach(email => {
                (0, vitest_1.expect)(validation_1.validation.isValidEmail(email)).toBe(false);
            });
        });
        (0, vitest_1.it)('should handle edge cases', () => {
            // Arrange
            const edgeCases = [
                null,
                undefined,
                123,
                {},
                [],
                'test@example.com ',
                ' test@example.com',
                'test @example.com',
            ];
            // Act & Assert
            edgeCases.forEach(email => {
                (0, vitest_1.expect)(validation_1.validation.isValidEmail(email)).toBe(false);
            });
        });
    });
    (0, vitest_1.describe)('Password Validation', () => {
        (0, vitest_1.it)('should validate strong passwords', () => {
            // Arrange
            const strongPasswords = [
                'Password123!',
                'MyStr0ng#Pass',
                'ComplexP@ssw0rd',
                'Secure123$',
                'ValidPass1!',
            ];
            // Act & Assert
            strongPasswords.forEach(password => {
                (0, vitest_1.expect)(validation_1.validation.isValidPassword(password)).toBe(true);
            });
        });
        (0, vitest_1.it)('should reject weak passwords', () => {
            // Arrange
            const weakPasswords = [
                '123456',
                'password',
                'PASSWORD',
                'Password',
                'Pass123',
                'Password!',
                '12345678',
                'qwerty',
                '',
                'a',
                'ab',
                'abc',
                'abcd',
                'abcde',
            ];
            // Act & Assert
            weakPasswords.forEach(password => {
                (0, vitest_1.expect)(validation_1.validation.isValidPassword(password)).toBe(false);
            });
        });
        (0, vitest_1.it)('should validate password strength levels', () => {
            // Arrange
            const passwordTests = [
                { password: '123456', expected: 'weak' },
                { password: 'password', expected: 'weak' },
                { password: 'Password', expected: 'medium' },
                { password: 'Password123', expected: 'strong' },
                { password: 'Password123!', expected: 'very-strong' },
                { password: 'MyStr0ng#Pass', expected: 'very-strong' },
            ];
            // Act & Assert
            passwordTests.forEach(({ password, expected }) => {
                (0, vitest_1.expect)(validation_1.validation.getPasswordStrength(password)).toBe(expected);
            });
        });
    });
    (0, vitest_1.describe)('Input Sanitization', () => {
        (0, vitest_1.it)('should sanitize HTML content', () => {
            // Arrange
            const htmlInputs = [
                '<script>alert("xss")</script>',
                '<img src="x" onerror="alert(1)">',
                '<div onclick="alert(1)">Click me</div>',
                '<a href="javascript:alert(1)">Link</a>',
                'Normal text with <b>bold</b>',
            ];
            const expectedOutputs = [
                'alert("xss")',
                '<img src="x">',
                '<div>Click me</div>',
                '<a>Link</a>',
                'Normal text with <b>bold</b>',
            ];
            // Act & Assert
            htmlInputs.forEach((input, index) => {
                (0, vitest_1.expect)(validation_1.validation.sanitizeInput(input)).toBe(expectedOutputs[index]);
            });
        });
        (0, vitest_1.it)('should handle special characters', () => {
            // Arrange
            const specialInputs = [
                'Text with "quotes"',
                "Text with 'apostrophes'",
                'Text with\nnewlines\tand\ttabs',
                'Text with & ampersands',
                'Text with < > brackets',
            ];
            // Act & Assert
            specialInputs.forEach(input => {
                const sanitized = validation_1.validation.sanitizeInput(input);
                (0, vitest_1.expect)(sanitized).not.toContain('<script>');
                (0, vitest_1.expect)(sanitized).not.toContain('javascript:');
                (0, vitest_1.expect)(sanitized).not.toContain('onerror=');
                (0, vitest_1.expect)(sanitized).not.toContain('onclick=');
            });
        });
    });
    (0, vitest_1.describe)('Boat Data Validation', () => {
        (0, vitest_1.it)('should validate boat names', () => {
            // Arrange
            const validNames = [
                'Boat Name',
                'Boat-Name',
                'Boat_Name',
                'Boat123',
                'My Awesome Boat',
            ];
            const invalidNames = [
                '',
                '   ',
                'Boat<script>',
                'Boat"Name',
                'Boat\'Name',
                null,
                undefined,
            ];
            // Act & Assert
            validNames.forEach(name => {
                (0, vitest_1.expect)(validation_1.validation.isValidBoatName(name)).toBe(true);
            });
            invalidNames.forEach(name => {
                (0, vitest_1.expect)(validation_1.validation.isValidBoatName(name)).toBe(false);
            });
        });
        (0, vitest_1.it)('should validate boat prices', () => {
            // Arrange
            const validPrices = [
                100,
                1000,
                1500.50,
                0,
                999999.99,
            ];
            const invalidPrices = [
                -100,
                -1,
                'not a number',
                null,
                undefined,
                Infinity,
                -Infinity,
            ];
            // Act & Assert
            validPrices.forEach(price => {
                (0, vitest_1.expect)(validation_1.validation.isValidPrice(price)).toBe(true);
            });
            invalidPrices.forEach(price => {
                (0, vitest_1.expect)(validation_1.validation.isValidPrice(price)).toBe(false);
            });
        });
        (0, vitest_1.it)('should validate boat capacity', () => {
            // Arrange
            const validCapacities = [
                1,
                2,
                10,
                50,
                100,
            ];
            const invalidCapacities = [
                0,
                -1,
                -10,
                'not a number',
                null,
                undefined,
                1000, // Too large
            ];
            // Act & Assert
            validCapacities.forEach(capacity => {
                (0, vitest_1.expect)(validation_1.validation.isValidCapacity(capacity)).toBe(true);
            });
            invalidCapacities.forEach(capacity => {
                (0, vitest_1.expect)(validation_1.validation.isValidCapacity(capacity)).toBe(false);
            });
        });
    });
    (0, vitest_1.describe)('Date Validation', () => {
        (0, vitest_1.it)('should validate date formats', () => {
            // Arrange
            const validDates = [
                '2025-01-01',
                '2025-12-31',
                '2024-02-29', // Leap year
                '2023-06-15',
            ];
            const invalidDates = [
                '2025-13-01', // Invalid month
                '2025-01-32', // Invalid day
                '2025-02-30', // Invalid day for February
                '2025/01/01', // Wrong format
                '01-01-2025', // Wrong format
                'not a date',
                '',
                null,
                undefined,
            ];
            // Act & Assert
            validDates.forEach(date => {
                (0, vitest_1.expect)(validation_1.validation.isValidDate(date)).toBe(true);
            });
            invalidDates.forEach(date => {
                (0, vitest_1.expect)(validation_1.validation.isValidDate(date)).toBe(false);
            });
        });
        (0, vitest_1.it)('should validate date ranges', () => {
            // Arrange
            const validRanges = [
                { start: '2025-01-01', end: '2025-01-07' },
                { start: '2025-06-01', end: '2025-06-30' },
                { start: '2025-12-01', end: '2025-12-31' },
            ];
            const invalidRanges = [
                { start: '2025-01-07', end: '2025-01-01' }, // End before start
                { start: '2025-01-01', end: '2025-01-01' }, // Same date
                { start: 'invalid', end: '2025-01-07' },
                { start: '2025-01-01', end: 'invalid' },
            ];
            // Act & Assert
            validRanges.forEach(range => {
                (0, vitest_1.expect)(validation_1.validation.isValidDateRange(range.start, range.end)).toBe(true);
            });
            invalidRanges.forEach(range => {
                (0, vitest_1.expect)(validation_1.validation.isValidDateRange(range.start, range.end)).toBe(false);
            });
        });
    });
    (0, vitest_1.describe)('Search Query Validation', () => {
        (0, vitest_1.it)('should validate search queries', () => {
            // Arrange
            const validQueries = [
                'boat',
                'catamaran',
                'sailboat',
                'luxury yacht',
                'boat with pool',
                'Boat Name',
                'boat-123',
                'boat_name',
            ];
            const invalidQueries = [
                '',
                '   ',
                'a', // Too short
                'ab', // Too short
                'boat<script>',
                'boat"name',
                'boat\'name',
                null,
                undefined,
            ];
            // Act & Assert
            validQueries.forEach(query => {
                (0, vitest_1.expect)(validation_1.validation.isValidSearchQuery(query)).toBe(true);
            });
            invalidQueries.forEach(query => {
                (0, vitest_1.expect)(validation_1.validation.isValidSearchQuery(query)).toBe(false);
            });
        });
        (0, vitest_1.it)('should sanitize search queries', () => {
            // Arrange
            const queries = [
                'boat<script>',
                'boat"name',
                'boat\'name',
                'boat with <b>bold</b>',
                'boat with & ampersand',
            ];
            const expectedOutputs = [
                'boat',
                'boatname',
                'boatname',
                'boat with bold',
                'boat with & ampersand',
            ];
            // Act & Assert
            queries.forEach((query, index) => {
                (0, vitest_1.expect)(validation_1.validation.sanitizeSearchQuery(query)).toBe(expectedOutputs[index]);
            });
        });
    });
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should handle null and undefined inputs gracefully', () => {
            // Arrange
            const nullInputs = [null, undefined];
            // Act & Assert
            nullInputs.forEach(input => {
                (0, vitest_1.expect)(validation_1.validation.isValidEmail(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidPassword(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidBoatName(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidPrice(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidCapacity(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidDate(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidSearchQuery(input)).toBe(false);
            });
        });
        (0, vitest_1.it)('should handle non-string inputs', () => {
            // Arrange
            const nonStringInputs = [123, {}, [], true, false];
            // Act & Assert
            nonStringInputs.forEach(input => {
                (0, vitest_1.expect)(validation_1.validation.isValidEmail(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidPassword(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidBoatName(input)).toBe(false);
                (0, vitest_1.expect)(validation_1.validation.isValidSearchQuery(input)).toBe(false);
            });
        });
        (0, vitest_1.it)('should handle very long inputs', () => {
            // Arrange
            const longInput = 'a'.repeat(10000);
            // Act & Assert
            (0, vitest_1.expect)(validation_1.validation.isValidEmail(longInput)).toBe(false);
            (0, vitest_1.expect)(validation_1.validation.isValidPassword(longInput)).toBe(false);
            (0, vitest_1.expect)(validation_1.validation.isValidBoatName(longInput)).toBe(false);
            (0, vitest_1.expect)(validation_1.validation.isValidSearchQuery(longInput)).toBe(false);
        });
    });
    (0, vitest_1.describe)('Performance', () => {
        (0, vitest_1.it)('should handle large datasets efficiently', () => {
            // Arrange
            const largeDataset = Array.from({ length: 1000 }, (_, i) => `email${i}@example.com`);
            // Act
            const startTime = Date.now();
            largeDataset.forEach(email => validation_1.validation.isValidEmail(email));
            const endTime = Date.now();
            // Assert
            (0, vitest_1.expect)(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
        });
        (0, vitest_1.it)('should handle concurrent validations', () => {
            // Arrange
            const inputs = [
                'test@example.com',
                'password123',
                'Boat Name',
                1000,
                10,
                '2025-01-01',
                'search query',
            ];
            // Act
            const results = inputs.map(input => {
                if (typeof input === 'string') {
                    if (input.includes('@'))
                        return validation_1.validation.isValidEmail(input);
                    if (input.includes('password'))
                        return validation_1.validation.isValidPassword(input);
                    if (input.includes('Boat'))
                        return validation_1.validation.isValidBoatName(input);
                    if (input.includes('2025'))
                        return validation_1.validation.isValidDate(input);
                    return validation_1.validation.isValidSearchQuery(input);
                }
                if (typeof input === 'number') {
                    if (input === 1000)
                        return validation_1.validation.isValidPrice(input);
                    return validation_1.validation.isValidCapacity(input);
                }
                return false;
            });
            // Assert
            (0, vitest_1.expect)(results).toEqual([true, false, true, true, true, true, true]);
        });
    });
});
