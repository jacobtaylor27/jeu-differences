import { Component } from '@angular/core';
import { DrawService } from '@app/services/draw-service/draw-service.service';

@Component({
    selector: 'app-between-images-tool-box',
    templateUrl: './between-images-tool-box.component.html',
    styleUrls: ['./between-images-tool-box.component.scss'],
})
export class BetweenImagesToolBoxComponent {
    constructor(readonly drawService: DrawService) {}
}
