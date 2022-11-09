import { Component, Input } from '@angular/core';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { Score } from '@common/score';

@Component({
    selector: 'app-game-score',
    templateUrl: './game-score.component.html',
    styleUrls: ['./game-score.component.scss'],
})
export class GameScoreComponent {
    @Input() scores: Score[];
    @Input() title: string;
    @Input() isMultiplayer: boolean;

    constructor(private readonly timeFormatter: TimeFormatterService) {}

    formatScoreTime(scoreTime: number): string {
        return this.timeFormatter.formatTime(scoreTime);
    }

    hasScores(): boolean {
        return this.scores.length > 0;
    }
}
