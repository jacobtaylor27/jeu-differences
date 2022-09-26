import { GameService } from '@app/services/game-service/game.service';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    constructor(private readonly gameService: GameService) {}
    async initialise(): Promise<void> {
        this.gameService.initialiseGames();
    }
}
