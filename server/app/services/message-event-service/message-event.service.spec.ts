import { EventMessageService } from '@app/services/message-event-service/message-event.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('EventMessage Service', () => {
    let eventMessageService: EventMessageService;

    beforeEach(() => {
        eventMessageService = Container.get(EventMessageService);
    });

    it('Should return a multiplayer difference found message with the player name if exists and if its a multiplayer game', () => {
        const userName = 'user';
        const expectedResult = `Difference trouvée par ${userName} a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.differenceFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference found message with the player name if exists and if its solo game', () => {
        const userName = 'user';
        const expectedResult = `Difference trouvée a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.differenceFoundMessage(userName, false)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference found message if player name is undefined even if its a multiplayer game', () => {
        const userName = undefined;
        const expectedResult = `Difference trouvée a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.differenceFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a multiplayer difference not found message with the player name if exists and if its a multiplayer game', () => {
        const userName = 'user';
        const expectedResult = `Erreur par ${userName} a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.differenceNotFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference not found message with the player name if exists and if its a solo game', () => {
        const userName = 'user';
        const expectedResult = `Erreur a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.differenceNotFoundMessage(userName, false)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference not found message if player name is undefined even if its a multiplayer game', () => {
        const userName = undefined;
        const expectedResult = `Erreur a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.differenceNotFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a leaving game message if username exists ', () => {
        const userName = 'user';
        const expectedResult = `${userName} a abandonné la partie a ${new Date().toLocaleTimeString()}`;
        expect(eventMessageService.leavingGameMessage(userName)).to.be.equal(expectedResult);
    });

    it('Should return null  if username is undefined while sending a leaving event message ', () => {
        const userName = undefined;
        expect(eventMessageService.leavingGameMessage(userName)).to.be.equal(null);
    });
});
