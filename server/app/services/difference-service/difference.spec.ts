/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { restore } from 'sinon';

describe('DifferenceService', () => {
    let difference: DifferenceService;
    beforeEach(() => {
        difference = new DifferenceService();
    });

    afterEach(() => {
        restore();
    });
    it('should check if all difference is found', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        stub(game, 'isGameInitialize').callsFake(() => false);
        stub(game, 'isGameOver').callsFake(() => false);
        let expectedDifference = { length: 10 } as Coordinate[][];
        let expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].set(game.identifier, new Map());
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        expect(difference.isAllDifferenceFound('', game)).to.equal(false);

        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 10 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        expect(difference.isAllDifferenceFound('', game)).to.equal(true);

        game['isMulti'] = true;
        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 4 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        expect(difference.isAllDifferenceFound('', game)).to.equal(false);

        game['isMulti'] = true;
        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        stub(difference, 'getNbDifferencesThreshold').callsFake(() => 5);
        expect(difference.isAllDifferenceFound('', game)).to.equal(true);
    });

});
