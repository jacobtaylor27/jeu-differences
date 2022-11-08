import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { GameCardButtonsComponent } from '@app/components/game-card-buttons/game-card-buttons.component';
import { GameScoreComponent } from '@app/components/game-score/game-score.component';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { SocketEvent } from '@common/socket-event';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GameCardComponent } from './game-card.component';

const GAME_CARD: GameCard = {
    gameInformation: {
        id: '1',
        name: 'test',
        idOriginalBmp: 'imageName',
        idEditedBmp: '1',
        thumbnail: 'image',
        soloScore: [
            {
                playerName: 'test2',
                time: 10,
            },
            {
                playerName: 'test',
                time: 10,
            },
        ],
        multiplayerScore: [
            {
                playerName: 'test2',
                time: 10,
            },
            {
                playerName: 'test',
                time: 10,
            },
        ],
        nbDifferences: 1,
        isMulti: true,
    },
    isAdminCard: true,
    isMulti: true,
};

describe('GameCardComponent', () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    let spyTimeFormatter: jasmine.SpyObj<TimeFormatterService>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    let socketServiceMock: CommunicationSocketService;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['getImgData']);
        spyCommunicationService.getImgData.and.returnValue(of());
        spyTimeFormatter = jasmine.createSpyObj('TimeFormatterService', ['formatTime']);
        socketHelper = new SocketTestHelper();
        socketServiceMock = new CommunicationSocketService();
        socketServiceMock['socket'] = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, RouterTestingModule, HttpClientModule],
            declarations: [GameCardComponent, GameScoreComponent, GameCardButtonsComponent],
            providers: [
                {
                    provide: CommunicationService,
                    useValue: spyCommunicationService,
                },
                {
                    provide: CommunicationSocketService,
                    useValue: socketServiceMock,
                },
                {
                    provide: TimeFormatterService,
                    useValue: spyTimeFormatter,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardComponent);
        component = fixture.componentInstance;
        component.gameCard = GAME_CARD;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the base64 image name', () => {
        expect(component.imageSrc).toEqual(GAME_CARD.gameInformation.thumbnail);
    });

    it('formatScoreTime should call getMMSSFormat from timerFormatter class', () => {
        component.formatScoreTime(1);
        expect(spyTimeFormatter.formatTime).toHaveBeenCalled();
    });

    it('getGameName should return the name of the game', () => {
        expect(component.getGameName()).toEqual('test');
    });

    it('isAdminCard should return true if the card is in admin mode', () => {
        expect(component.isAdminCard()).toEqual(true);
    });

    it('getMultiplayerScores should return the multiplayer scores for a given game', () => {
        const scores = component.getMultiplayerScores();
        expect(scores).toBeDefined();
        expect(scores.length).toEqual(2);
    });

    it('getSinglePlayerScores should return the single player scores for a given game', () => {
        const scores = component.getSinglePlayerScores();
        expect(scores).toBeDefined();
        expect(scores.length).toEqual(2);
    });

    it('hasMultiplayerScores should return true if the game has a multiplayer score', () => {
        expect(component.hasMultiplayerScores()).toEqual(true);
    });

    it('hasSinglePlayerScores should return true if the game has a single player score', () => {
        expect(component.hasSinglePlayerScores()).toEqual(true);
    });

    it('should get all the games waiting for opponent', () => {
        socketHelper.peerSideEmit(SocketEvent.GetGamesWaiting, ['1', '2']);
        component.ngOnInit();
        expect(GAME_CARD.isMulti).toEqual(true);
    });
});
