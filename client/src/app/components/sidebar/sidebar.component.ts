import { AfterContentInit, Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterContentInit {
    gameMode: GameMode;
    gameName: string;
    isMulti: boolean;
    penaltyTime : number;
    differenceTime : number

    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.gameInformationHandlerService.getConstants();
        this.gameMode = this.gameInformationHandlerService.getGameMode();
        this.gameName = this.gameInformationHandlerService.getGameName();
        this.isMulti = this.gameInformationHandlerService.isMulti;
        this.gameInformationHandlerService.$newGame.subscribe(() => {
            this.gameMode = this.gameInformationHandlerService.getGameMode();
            this.gameName = this.gameInformationHandlerService.getGameName();
        });
    }

    ngAfterContentInit():  void {
        this.penaltyTime = this.gameInformationHandlerService.gameTimeConstants.penaltyTime;
        this.differenceTime = this.gameInformationHandlerService.gameTimeConstants.successTime;
    }

    isSoloMode(){
        return !this.gameInformationHandlerService.isMulti;
    }

    isLimitedTimeMode(){
        return this.gameInformationHandlerService.isLimitedTime();
    }

    
}
