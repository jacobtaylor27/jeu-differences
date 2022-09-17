import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Tool } from '@app/constant/tool';
import { Pencil } from '@app/interfaces/pencil';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent {
    pencil: Pencil = { width: 5, cap: 'round', color: '#00000', state: Tool.Pencil };
    toolEnum: typeof Tool = Tool;
    constructor(public toolService: ToolBoxService) {}

    changePencilState(tool: Tool) {
        this.pencil.state = tool;
        this.toolService.$pencil.next(this.pencil);
    }

    formatLabel(value: number | null) {
        if (value === null) {
            return 0;
        }
        return value.toString() + 'px';
    }

    changePencilColor(color: string) {
        this.pencil.color = color;
        this.toolService.$pencil.next(this.pencil);
    }

    changePencilWith(event: MatSliderChange) {
        this.pencil.width = event.value !== null ? event.value : 0;
        this.toolService.$pencil.next(this.pencil);
    }
}
