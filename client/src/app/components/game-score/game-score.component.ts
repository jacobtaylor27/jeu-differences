import { Component, Input } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
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

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }

    hasScores(): boolean {
        return this.scores.length > 0;
    }
}
