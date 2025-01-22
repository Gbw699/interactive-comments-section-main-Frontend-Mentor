import { IdReferenceService } from './id-reference.service';

describe('IdReferenceService', () => {
  let service: IdReferenceService;

  beforeEach(() => {
    service = new IdReferenceService();
  });

  describe('setIdReference', () => {
    it('Should update the id reference state with a new value', () => {
      service.setIdReference(10);

      expect(service.idReference()).toBe(10);
    });
  });
});
