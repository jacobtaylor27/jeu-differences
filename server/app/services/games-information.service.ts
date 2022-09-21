import { Collection } from "mongodb";
import { Service } from "typedi";
import { DatabaseService } from "./database.service";


const GAMES_INFORMATION = 'games-information';

@Service()
export class GamesInformation {
    constructor(private readonly dbService: DatabaseService) {}

    get Collection(): Collection {
        return this.dbService.db.collection(GAMES_INFORMATION);
    }
}