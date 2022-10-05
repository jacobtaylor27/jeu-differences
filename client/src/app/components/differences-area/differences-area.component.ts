import { AfterViewChecked, Component } from '@angular/core';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent implements AfterViewChecked {
    name: string;
    nbDifferences: string;

    constructor(
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly differenceDetectionHandler: DifferencesDetectionHandlerService,
    ) {
        this.name = this.gameInformationHandlerService.getPlayerName();
    }

    ngAfterViewChecked(): void {
        this.setNbDifferencesFound();
    }

    private setNbDifferencesFound() {
        if (!this.differenceDetectionHandler.nbDifferencesFound) {
            this.nbDifferences = '0 / ' + this.gameInformationHandlerService.gameInformation.differences.length;
        } else {
            this.nbDifferences = this.differenceDetectionHandler.nbDifferencesFound + ' / ' + this.differenceDetectionHandler.nbTotalDifferences;
        }
    }
}
