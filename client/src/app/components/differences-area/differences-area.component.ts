import { Component, OnInit } from '@angular/core';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent implements OnInit {
    name: string;
    nbDifferences: string;

    constructor(
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly differenceDetectionHandler: DifferencesDetectionHandlerService,
    ) {
        this.name = this.gameInformationHandlerService.getPlayerName();
    }

    ngOnInit(): void {
        this.differenceDetectionHandler.resetNumberDifferencesFound();
        this.setNbDifferencesFound();
    }

    setNbDifferencesFound() {
        if (!this.differenceDetectionHandler.nbDifferencesFound) {
            this.nbDifferences = '0 / ' + this.gameInformationHandlerService.getNbDifferences();
        } else {
            this.nbDifferences = this.differenceDetectionHandler.nbDifferencesFound + ' / ' + this.gameInformationHandlerService.getNbDifferences();;
        }
        return this.nbDifferences;
    }
}
