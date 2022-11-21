import { PrivateGameInformation } from '@app/interface/game-info';
import { Service } from 'typedi';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';

@Service()
export class LimitedTimeGame {
    gamesShuffled: Map<string, PrivateGameInformation[]> = new Map();

    constructor(private readonly gameInfoService: GameInfoService) {}

    async generateGames() {
        const allGames = await this.gameInfoService.getAllGameInfos();
        return this.shuffle(allGames);
    }

    private shuffle(array: PrivateGameInformation[]) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}
