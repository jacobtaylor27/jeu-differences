import { Service } from 'typedi';

@Service()
export class EventMessageService {
    differenceFoundMessage(userName?: string | undefined, isMulti?: boolean | undefined) {
        return isMulti && userName
            ? `Difference trouvée par ${userName} a ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`
            : `Difference trouvée a ${new Date().toLocaleTimeString()}`;
    }

    differenceNotFoundMessage(userName?: string | undefined, isMulti?: boolean | undefined) {
        return isMulti && userName
            ? `Erreur par ${userName} a ${new Date().toLocaleTimeString()}`
            : `Erreur a ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`;
    }

    leavingGameMessage(userName: string | undefined) {
        return userName ? `${userName} a abandonné la partie a ${new Date().toLocaleTimeString()}` : null;
    }
}
