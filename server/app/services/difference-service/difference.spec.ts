/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { expect } from 'chai';
import { restore, spy, stub } from 'sinon';

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


    it('should return undefined if differences is not found with coordinate', () => {
        const expectedDifferences = [[{} as Coordinate]];
        expect(difference.findDifference({ x: 0, y: 0 }, expectedDifferences)).to.equal(undefined);
    });

    it('should find a difference and return it', () => {
        const expectedDifferencesFound = [
            { x: 0, y: 0 },
            { x: 1, y: -1 },
        ];
        const expectedDifferences = [expectedDifferencesFound];
        expect(difference.findDifference({ x: 0, y: 0 }, expectedDifferences)).to.deep.equal(expectedDifferencesFound);
    });
});
