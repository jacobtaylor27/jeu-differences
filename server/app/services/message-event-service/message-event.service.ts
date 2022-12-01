import { Service } from 'typedi';
import { MessageRecord } from '@common/message-record';

@Service()
export class EventMessageService {
    differenceFoundMessage(userName?: string | undefined, isMulti?: boolean | undefined) {
        return isMulti && userName
            ? `Difference trouvée par ${userName} a ${new Date().toLocaleTimeString('en-US')}`
            : `Difference trouvée a ${new Date().toLocaleTimeString('en-US')}`;
    }

    differenceNotFoundMessage(userName?: string | undefined, isMulti?: boolean | undefined) {
        return isMulti && userName
            ? `Erreur par ${userName} a ${new Date().toLocaleTimeString('en-US')}`
            : `Erreur a ${new Date().toLocaleTimeString('en-US')}`;
    }

    leavingGameMessage(userName: string | undefined) {
        return userName ? `${userName} a abandonné la partie a ${new Date().toLocaleTimeString('en-US')}` : null;
    }
}
