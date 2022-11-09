import { EventMessageService } from '@app/services/message-event-service/message-event.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('EventMessage Service', () => {
    let eventMessageService: EventMessageService;

    beforeEach(() => {
        eventMessageService = Container.get(EventMessageService);
    });

    it('Should return null  if username is undefined while sending a leaving event message ', () => {
        const userName = undefined;
        expect(eventMessageService.leavingGameMessage(userName)).to.be.equal(null);
    });
});
