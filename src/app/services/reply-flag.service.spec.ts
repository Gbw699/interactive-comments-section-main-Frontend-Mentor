import { ReplyFlagService } from './reply-flag.service';

describe('ReplyFlagService', () => {
  let service: ReplyFlagService;

  beforeEach(() => {
    service = new ReplyFlagService();
  });

  describe('setReplyFlag', () => {
    it('Should update the reply flag with a new boolean value', () => {
      service.setReplyFlag(true);

      expect(service.replyFlag()).toBe(true);
    });
  });
});
