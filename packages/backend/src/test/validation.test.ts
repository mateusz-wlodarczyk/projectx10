import { describe, it, expect } from 'vitest'
import { validation } from '../utils/validation'

describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'a@b.c',
      ]

      // Act & Assert
      validEmails.forEach(email => {
        expect(validation.isValidEmail(email)).toBe(true)
      })
    })

    it('should reject invalid email formats', () => {
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
      ]

      // Act & Assert
      invalidEmails.forEach(email => {
        expect(validation.isValidEmail(email)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
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
      ]

      // Act & Assert
      edgeCases.forEach(email => {
        expect(validation.isValidEmail(email as any)).toBe(false)
      })
    })
  })

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      // Arrange
      const strongPasswords = [
        'Password123!',
        'MyStr0ng#Pass',
        'ComplexP@ssw0rd',
        'Secure123$',
        'ValidPass1!',
      ]

      // Act & Assert
      strongPasswords.forEach(password => {
        expect(validation.isValidPassword(password)).toBe(true)
      })
    })

    it('should reject weak passwords', () => {
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
      ]

      // Act & Assert
      weakPasswords.forEach(password => {
        expect(validation.isValidPassword(password)).toBe(false)
      })
    })

    it('should validate password strength levels', () => {
      // Arrange
      const passwordTests = [
        { password: '123456', expected: 'weak' },
        { password: 'password', expected: 'weak' },
        { password: 'Password', expected: 'medium' },
        { password: 'Password123', expected: 'strong' },
        { password: 'Password123!', expected: 'very-strong' },
        { password: 'MyStr0ng#Pass', expected: 'very-strong' },
      ]

      // Act & Assert
      passwordTests.forEach(({ password, expected }) => {
        expect(validation.getPasswordStrength(password)).toBe(expected)
      })
    })
  })

  describe('Input Sanitization', () => {
    it('should sanitize HTML content', () => {
      // Arrange
      const htmlInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        '<div onclick="alert(1)">Click me</div>',
        '<a href="javascript:alert(1)">Link</a>',
        'Normal text with <b>bold</b>',
      ]

      const expectedOutputs = [
        'alert("xss")',
        '<img src="x">',
        '<div>Click me</div>',
        '<a>Link</a>',
        'Normal text with <b>bold</b>',
      ]

      // Act & Assert
      htmlInputs.forEach((input, index) => {
        expect(validation.sanitizeInput(input)).toBe(expectedOutputs[index])
      })
    })

    it('should handle special characters', () => {
      // Arrange
      const specialInputs = [
        'Text with "quotes"',
        "Text with 'apostrophes'",
        'Text with\nnewlines\tand\ttabs',
        'Text with & ampersands',
        'Text with < > brackets',
      ]

      // Act & Assert
      specialInputs.forEach(input => {
        const sanitized = validation.sanitizeInput(input)
        expect(sanitized).not.toContain('<script>')
        expect(sanitized).not.toContain('javascript:')
        expect(sanitized).not.toContain('onerror=')
        expect(sanitized).not.toContain('onclick=')
      })
    })
  })

  describe('Boat Data Validation', () => {
    it('should validate boat names', () => {
      // Arrange
      const validNames = [
        'Boat Name',
        'Boat-Name',
        'Boat_Name',
        'Boat123',
        'My Awesome Boat',
      ]

      const invalidNames = [
        '',
        '   ',
        'Boat<script>',
        'Boat"Name',
        'Boat\'Name',
        null,
        undefined,
      ]

      // Act & Assert
      validNames.forEach(name => {
        expect(validation.isValidBoatName(name)).toBe(true)
      })

      invalidNames.forEach(name => {
        expect(validation.isValidBoatName(name as any)).toBe(false)
      })
    })

    it('should validate boat prices', () => {
      // Arrange
      const validPrices = [
        100,
        1000,
        1500.50,
        0,
        999999.99,
      ]

      const invalidPrices = [
        -100,
        -1,
        'not a number',
        null,
        undefined,
        Infinity,
        -Infinity,
      ]

      // Act & Assert
      validPrices.forEach(price => {
        expect(validation.isValidPrice(price)).toBe(true)
      })

      invalidPrices.forEach(price => {
        expect(validation.isValidPrice(price as any)).toBe(false)
      })
    })

    it('should validate boat capacity', () => {
      // Arrange
      const validCapacities = [
        1,
        2,
        10,
        50,
        100,
      ]

      const invalidCapacities = [
        0,
        -1,
        -10,
        'not a number',
        null,
        undefined,
        1000, // Too large
      ]

      // Act & Assert
      validCapacities.forEach(capacity => {
        expect(validation.isValidCapacity(capacity)).toBe(true)
      })

      invalidCapacities.forEach(capacity => {
        expect(validation.isValidCapacity(capacity as any)).toBe(false)
      })
    })
  })

  describe('Date Validation', () => {
    it('should validate date formats', () => {
      // Arrange
      const validDates = [
        '2025-01-01',
        '2025-12-31',
        '2024-02-29', // Leap year
        '2023-06-15',
      ]

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
      ]

      // Act & Assert
      validDates.forEach(date => {
        expect(validation.isValidDate(date)).toBe(true)
      })

      invalidDates.forEach(date => {
        expect(validation.isValidDate(date as any)).toBe(false)
      })
    })

    it('should validate date ranges', () => {
      // Arrange
      const validRanges = [
        { start: '2025-01-01', end: '2025-01-07' },
        { start: '2025-06-01', end: '2025-06-30' },
        { start: '2025-12-01', end: '2025-12-31' },
      ]

      const invalidRanges = [
        { start: '2025-01-07', end: '2025-01-01' }, // End before start
        { start: '2025-01-01', end: '2025-01-01' }, // Same date
        { start: 'invalid', end: '2025-01-07' },
        { start: '2025-01-01', end: 'invalid' },
      ]

      // Act & Assert
      validRanges.forEach(range => {
        expect(validation.isValidDateRange(range.start, range.end)).toBe(true)
      })

      invalidRanges.forEach(range => {
        expect(validation.isValidDateRange(range.start, range.end)).toBe(false)
      })
    })
  })

  describe('Search Query Validation', () => {
    it('should validate search queries', () => {
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
      ]

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
      ]

      // Act & Assert
      validQueries.forEach(query => {
        expect(validation.isValidSearchQuery(query)).toBe(true)
      })

      invalidQueries.forEach(query => {
        expect(validation.isValidSearchQuery(query as any)).toBe(false)
      })
    })

    it('should sanitize search queries', () => {
      // Arrange
      const queries = [
        'boat<script>',
        'boat"name',
        'boat\'name',
        'boat with <b>bold</b>',
        'boat with & ampersand',
      ]

      const expectedOutputs = [
        'boat',
        'boatname',
        'boatname',
        'boat with bold',
        'boat with & ampersand',
      ]

      // Act & Assert
      queries.forEach((query, index) => {
        expect(validation.sanitizeSearchQuery(query)).toBe(expectedOutputs[index])
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      // Arrange
      const nullInputs = [null, undefined]

      // Act & Assert
      nullInputs.forEach(input => {
        expect(validation.isValidEmail(input as any)).toBe(false)
        expect(validation.isValidPassword(input as any)).toBe(false)
        expect(validation.isValidBoatName(input as any)).toBe(false)
        expect(validation.isValidPrice(input as any)).toBe(false)
        expect(validation.isValidCapacity(input as any)).toBe(false)
        expect(validation.isValidDate(input as any)).toBe(false)
        expect(validation.isValidSearchQuery(input as any)).toBe(false)
      })
    })

    it('should handle non-string inputs', () => {
      // Arrange
      const nonStringInputs = [123, {}, [], true, false]

      // Act & Assert
      nonStringInputs.forEach(input => {
        expect(validation.isValidEmail(input as any)).toBe(false)
        expect(validation.isValidPassword(input as any)).toBe(false)
        expect(validation.isValidBoatName(input as any)).toBe(false)
        expect(validation.isValidSearchQuery(input as any)).toBe(false)
      })
    })

    it('should handle very long inputs', () => {
      // Arrange
      const longInput = 'a'.repeat(10000)

      // Act & Assert
      expect(validation.isValidEmail(longInput)).toBe(false)
      expect(validation.isValidPassword(longInput)).toBe(false)
      expect(validation.isValidBoatName(longInput)).toBe(false)
      expect(validation.isValidSearchQuery(longInput)).toBe(false)
    })
  })

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      // Arrange
      const largeDataset = Array.from({ length: 1000 }, (_, i) => `email${i}@example.com`)

      // Act
      const startTime = Date.now()
      largeDataset.forEach(email => validation.isValidEmail(email))
      const endTime = Date.now()

      // Assert
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
    })

    it('should handle concurrent validations', () => {
      // Arrange
      const inputs = [
        'test@example.com',
        'password123',
        'Boat Name',
        1000,
        10,
        '2025-01-01',
        'search query',
      ]

      // Act
      const results = inputs.map(input => {
        if (typeof input === 'string') {
          if (input.includes('@')) return validation.isValidEmail(input)
          if (input.includes('password')) return validation.isValidPassword(input)
          if (input.includes('Boat')) return validation.isValidBoatName(input)
          if (input.includes('2025')) return validation.isValidDate(input)
          return validation.isValidSearchQuery(input)
        }
        if (typeof input === 'number') {
          if (input === 1000) return validation.isValidPrice(input)
          return validation.isValidCapacity(input)
        }
        return false
      })

      // Assert
      expect(results).toEqual([true, false, true, true, true, true, true])
    })
  })
})
