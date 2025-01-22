import { UserToReplyService } from './user-to-reply.service';

describe('UserToReplyService', () => {
  let service: UserToReplyService;

  beforeEach(() => {
    service = new UserToReplyService();
  });

  describe('setUserToReply', () => {
    it('Should update the user to reply state with a new value', () => {
      service.setUserToReply('value for testing');

      expect(service.userToReply()).toBe('value for testing');
    });
  });
});
