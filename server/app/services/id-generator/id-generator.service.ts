import { DatabaseService } from '@app/services/database-service/database.service';
import { Service } from 'typedi';

@Service()
export class IdGeneratorService {
    private counter: number;
    constructor(private readonly databaseService: DatabaseService) {
        this.counter = this.databaseService.database
    }
    async generateUniqueId(): Promise<number> {
        const uniqueId = this.counter;
        this.counter++;
        return uniqueId;
    }
}
