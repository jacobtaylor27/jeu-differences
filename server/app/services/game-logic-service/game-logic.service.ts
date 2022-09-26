import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';
@Service()
export class GameLogicService {
    validateCoordinates(gameId: number, coordinate: Coordinate): Coordinate[] | undefined {
        // TODO: vérifier si les coordonnées sont à l'intérieur
        // Aller chercher les coordonnées de différences et regarder si les coordonnées passées en paramètres
        // sont à l'intérieur.
        return [{ row: coordinate.row, column: coordinate.column }];
    }
}
