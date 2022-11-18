import { GameTimeConstantService } from './game-time-constants.service';

describe('Game Time Constants Service', () => {
    let gameTimeConstantService: GameTimeConstantService;

    beforeEach(() => {
        gameTimeConstantService = new GameTimeConstantService();
    });

    it('should read the file and return the values', async () => {
        gameTimeConstantService.getGameTimeConstant().then();
    });
    // it('should write the values to the file', async () => {});
});
