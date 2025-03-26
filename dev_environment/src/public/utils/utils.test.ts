import { capitalizeFirst } from './utils';

describe('Utils', () => {
    describe('capitalizeFirst', () => {
        it('should capitalize the first letter of a string', () => {
            // Arrange
            const input = 'hello';
            const expected = 'Hello';

            // Act
            const result = capitalizeFirst(input);

            // Assert
            expect(result).toBe(expected);
        });

        it('should return empty string when input is empty', () => {
            // Arrange
            const input = '';

            // Act
            const result = capitalizeFirst(input);

            // Assert
            expect(result).toBe('');
        });

        it('should handle single character strings', () => {
            // Arrange
            const input = 'a';
            const expected = 'A';

            // Act
            const result = capitalizeFirst(input);

            // Assert
            expect(result).toBe(expected);
        });

        it('should only capitalize the first letter and leave the rest unchanged', () => {
            // Arrange
            const input = 'hELLO wORLD';
            const expected = 'HELLO wORLD';

            // Act
            const result = capitalizeFirst(input);

            // Assert
            expect(result).toBe(expected);
        });
    });
});