import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {
  let pipe: CustomDatePipe;

  let mockMinutesDiffDate: Date;
  let mockHoursDiffDate: Date;
  let mockDaysDiffDate: Date;
  let mockWeeksDiffDate: Date;
  let mockMonthsDiffDate: Date;
  let mockYearsDiffDate: Date;

  beforeEach(() => {
    pipe = new CustomDatePipe();
    pipe.newDate = new Date(2025, 11, 31, 23, 59, 59);
  });

  describe('Minutes difference', () => {
    it('If minutes difference is 1, it should return an specific message', () => {
      mockMinutesDiffDate = new Date(2025, 11, 31, 23, 58, 59);

      expect(pipe.transform(mockMinutesDiffDate)).toBe('1 minute ago');
    });
    it('If minutes difference is less or more than 1, it should return an specific message', () => {
      mockMinutesDiffDate = new Date(2025, 11, 31, 23, 50, 59);

      expect(pipe.transform(mockMinutesDiffDate)).toBe('9 minutes ago');
    });
  });

  describe('Hours difference', () => {
    it('If hours difference is 1, it should return an specific message', () => {
      mockHoursDiffDate = new Date(2025, 11, 31, 22, 59, 59);

      expect(pipe.transform(mockHoursDiffDate)).toBe('1 hour ago');
    });
    it('If hours difference is less or more than 1, it should return an specific message', () => {
      mockHoursDiffDate = new Date(2025, 11, 31, 14, 59, 59);

      expect(pipe.transform(mockHoursDiffDate)).toBe('9 hours ago');
    });
  });

  describe('Days difference', () => {
    it('If days difference is 1, it should return an specific message', () => {
      mockDaysDiffDate = new Date(2025, 11, 30, 23, 59, 59);

      expect(pipe.transform(mockDaysDiffDate)).toBe('1 day ago');
    });
    it('If days difference is less or more than 1, it should return an specific message', () => {
      mockDaysDiffDate = new Date(2025, 11, 26, 23, 59, 59);

      expect(pipe.transform(mockDaysDiffDate)).toBe('5 days ago');
    });
  });

  describe('Weeks difference', () => {
    it('If weeks difference is 1, it should return an specific message', () => {
      mockWeeksDiffDate = new Date(2025, 11, 23, 23, 59, 59);

      expect(pipe.transform(mockWeeksDiffDate)).toBe('1 week ago');
    });
    it('If weeks difference is less or more than 1, it should return an specific message', () => {
      mockWeeksDiffDate = new Date(2025, 11, 16, 23, 59, 59);

      expect(pipe.transform(mockWeeksDiffDate)).toBe('2 weeks ago');
    });
  });

  describe('Months difference', () => {
    it('If months difference is 1, it should return an specific message', () => {
      mockMonthsDiffDate = new Date(2025, 10, 31, 23, 59, 59);

      expect(pipe.transform(mockMonthsDiffDate)).toBe('1 month ago');
    });
    it('If months difference is less or more than 1, it should return an specific message', () => {
      mockMonthsDiffDate = new Date(2025, 7, 31, 23, 59, 59);

      expect(pipe.transform(mockMonthsDiffDate)).toBe('4 months ago');
    });
  });

  describe('Years difference', () => {
    it('If years difference is 1, it should return an specific message', () => {
      mockYearsDiffDate = new Date(2024, 11, 31, 23, 59, 59);

      expect(pipe.transform(mockYearsDiffDate)).toBe('1 year ago');
    });
    it('If years difference is less or more than 1, it should return an specific message', () => {
      mockYearsDiffDate = new Date(2020, 11, 31, 23, 59, 59);

      expect(pipe.transform(mockYearsDiffDate)).toBe('5 years ago');
    });
  });
});
