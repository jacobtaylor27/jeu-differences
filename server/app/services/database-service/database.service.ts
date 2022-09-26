import { Game } from '@common/game';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    getGames(): Game[] {
        return [];
    }
}
