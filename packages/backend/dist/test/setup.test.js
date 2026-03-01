"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Test Setup Verification', () => {
    (0, vitest_1.it)('should run basic test', () => {
        (0, vitest_1.expect)(1 + 1).toBe(2);
    });
    (0, vitest_1.it)('should have access to vi mock utilities', () => {
        const mockFn = vitest_1.vi.fn();
        mockFn('test');
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledWith('test');
    });
});
