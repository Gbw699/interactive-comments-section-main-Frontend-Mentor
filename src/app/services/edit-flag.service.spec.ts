import { EditFlagService } from './edit-flag.service';

describe('EditFlagService', () => {
  let service: EditFlagService;

  beforeEach(() => {
    service = new EditFlagService();
  });

  describe('setEditFlag', () => {
    it('Should update the edit flag state with a new boolean value', () => {
      service.setEditFlag(true);

      expect(service.editFlag()).toBe(true);
    });
  });
});
