import { ExperienceRepository } from './experience.repository';
import { ExperienceService } from './experience.service';

describe('ExperienceService', () => {
  const service = new ExperienceService({} as ExperienceRepository);

  describe('getPeriod', () => {
    it('counts months up to now for the current job', () => {
      const period = service.getPeriod(
        { startedAt: new Date('2024-11-01'), endedAt: null },
        new Date('2026-11-14'),
      );

      expect(period).toEqual({ start: '2024-11', end: null, isCurrent: true, months: 25 });
    });

    it('includes both the first and the last month', () => {
      const period = service.getPeriod({
        startedAt: new Date('2023-01-01'),
        endedAt: new Date('2023-12-01'),
      });

      expect(period).toEqual({ start: '2023-01', end: '2023-12', isCurrent: false, months: 12 });
    });
  });
});
