import { Service } from 'typedi';

@Service()
// S'il y a des ids dans la base de données, j'ai déjà des images. C'est certain qu'il y aura déjà des images.
// Faut-il que je vérifie que des images existes déjà? Oui? Ces images vont avoir un id, je ne peux pas
// leur donner un id similaire.
export class IdGeneratorService {
    async generateBmpId(): Promise<number> {
        return 0;
    }
    async generateGameId(): Promise<number> {
        return 0;
    }
}
