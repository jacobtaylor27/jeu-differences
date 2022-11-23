import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Command } from '@app/interfaces/command';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { Line } from '@app/interfaces/line';
import { Pencil } from '@app/interfaces/pencil';
import { Stroke } from '@app/interfaces/stroke';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

import { DrawService } from './draw-service.service';

describe('DrawServiceService', () => {
    let service: DrawService;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let canvasStateServiceSpyObj: jasmine.SpyObj<CanvasStateService>;

    beforeEach(() => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $resetBackground: new Map(), $resetForeground: new Map() });
        canvasStateServiceSpyObj = jasmine.createSpyObj('CanvasStateService', ['getCanvasState', 'getFocusedCanvas']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: CanvasStateService, useValue: canvasStateServiceSpyObj },
            ],
        });
        service = TestBed.inject(DrawService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('reposition should return a position', () => {
        const expectedReposition = { x: 10, y: 10 };
        expect(service.reposition({ offsetLeft: 0, offsetTop: 0 } as HTMLCanvasElement, { clientX: 10, clientY: 10 } as MouseEvent)).toEqual(
            expectedReposition,
        );
    });

    it('should reset background for both canvas', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        const spyResetAllBackground = spyOn(service, 'clearAllBackground');
        const spyClearBackground = spyOn(service, 'clearBackground');
        service.resetBackground(CanvasType.Both);
        expect(spyResetAllBackground).toHaveBeenCalled();
        expect(spyClearBackground).not.toHaveBeenCalled();
    });

    it('should reset background for Left background', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        const spyResetAllBackground = spyOn(service, 'clearAllBackground');
        const spyClearBackground = spyOn(service, 'clearBackground');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return {
                canvasType: CanvasType.Left,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                foreground: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                background: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            };
        });
        service.resetBackground(CanvasType.Left);
        expect(spyResetAllBackground).not.toHaveBeenCalled();
        expect(spyClearBackground).toHaveBeenCalled();
    });

    it('should reset background for Right background', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        const spyResetAllBackground = spyOn(service, 'clearAllBackground');
        const spyClearBackground = spyOn(service, 'clearBackground');
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return {
                canvasType: CanvasType.Right,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                foreground: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                background: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            };
        });
        service.resetBackground(CanvasType.Right);
        expect(spyResetAllBackground).not.toHaveBeenCalled();
        expect(spyClearBackground).toHaveBeenCalled();
    });

    it('should check if the pencil is in mode eraser', () => {
        expect(service.isEraser(Tool.Eraser)).toBeTrue();
        expect(service.isEraser(Tool.Pencil)).toBeFalse();
    });

    it('should add drawing canvas', () => {
        const spyDrawImage = spyOn(service.$drawingImage, 'set');
        service.addDrawingCanvas(CanvasType.Left);
        expect(spyDrawImage).toHaveBeenCalled();
    });

    it('should reset foreground for left canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return {
                canvasType: CanvasType.Left,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                foreground: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                background: {} as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            };
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(service, 'clearForeground').and.callFake(() => {});
        service.resetForeground(CanvasType.Left);
        expect(spyClearForeground).toHaveBeenCalled();
    });

    it('should reset foreground for right canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return {
                canvasType: CanvasType.Right,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                foreground: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                background: {} as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            };
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(service, 'clearForeground').and.callFake(() => {});
        service.resetForeground(CanvasType.Right);
        expect(spyClearForeground).toHaveBeenCalled();
    });

    it('should update mouse coordinate', () => {
        const expectedFinalCoord = { x: 1, y: 1 };
        const expectedInitCoord = { x: 0, y: 0 };
        service.coordDraw = expectedInitCoord;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return {
                canvasType: CanvasType.Right,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                foreground: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
                background: {} as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            };
        });
        spyOn(service, 'reposition').and.callFake(() => expectedFinalCoord);
        expect(service['updateMouseCoordinates']({} as MouseEvent)).toEqual({ initCoord: expectedInitCoord, finalCoord: expectedFinalCoord });
    });

    it('drawPoint should set the style of the pencil and create the point', () => {
        service.coordDraw = { x: 0, y: 0 };
        const expectedCanvasState = {
            canvasType: CanvasType.Left,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => expectedCanvasState);
        service.pencil = { width: { pencil: 5, eraser: 0 }, cap: 'round', color: '#000000', state: Tool.Pencil };
        spyOn(service, 'reposition').and.returnValue({ x: 0, y: 0 });
        const ctx = expectedCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const beginPathSpy = spyOn(ctx, 'beginPath');
        const moveToSpy = spyOn(ctx, 'moveTo');
        const lineToSpy = spyOn(ctx, 'lineTo');
        const stokeSpy = spyOn(ctx, 'stroke');
        service.createStroke(
            { initCoord: { x: 0, y: 0 }, finalCoord: { x: 0, y: 0 } } as Line,
            { width: service.pencil.width.pencil, cap: service.pencil.cap, color: service.pencil.color } as StrokeStyle,
        );
        expect(beginPathSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(stokeSpy).toHaveBeenCalled();
        expect(ctx.lineWidth).toEqual(service.pencil.width.pencil);
        expect(ctx.lineCap).toEqual(service.pencil.cap);
        expect(ctx.strokeStyle).toEqual(service.pencil.color);
    });

    it('startDrawing should handle mouse event and return undefined if no canvas is in focus', () => {
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return undefined;
        });
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(service.isClick).toBeTruthy();
    });

    it('startDrawing should handle mouse event if no canvas is in focus', () => {
        const respositionSpy = spyOn(service, 'reposition');
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return undefined;
        });
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(respositionSpy).not.toHaveBeenCalled();
        expect(service.isClick).toBeTruthy();
    });

    it('startDrawing should handle mouse event if a canvas is in focus', () => {
        const respositionSpy = spyOn(service, 'reposition');
        const setCurrentCommandSpy = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            const canvasState: DrawingBoardState = {
                canvasType: CanvasType.Right,
                foreground: {} as ElementRef<HTMLCanvasElement>,
                background: {} as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            };
            return canvasState;
        });
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(respositionSpy).toHaveBeenCalled();
        expect(setCurrentCommandSpy).toHaveBeenCalled();
        expect(service.isClick).toBeTruthy();
    });

    it('draw(...) should return undefined if the pencil is not clicked', () => {
        service['isClick'] = false;
        const spyOnMouseCoordinate = spyOn(Object.getPrototypeOf(service), 'updateMouseCoordinates');
        const defaultReturn = service.draw({} as MouseEvent);
        expect(defaultReturn).toBe(undefined);
        expect(spyOnMouseCoordinate).not.toHaveBeenCalled();
    });

    it('draw(...) should call updateMouseCoordinates(event)', () => {
        service['isClick'] = true;
        const spyOnMouseCoordinate = spyOn(Object.getPrototypeOf(service), 'updateMouseCoordinates').and.callFake(() => {
            const newLine: Line = {
                initCoord: { x: 0, y: 0 },
                finalCoord: { x: 0, y: 0 },
            };
            return newLine;
        });
        const stroke: Stroke = {
            lines: [],
        };
        const newCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [stroke],
            style: {} as StrokeStyle,
        };
        service['currentCommand'] = newCommand;
        service.draw({} as MouseEvent);
        expect(spyOnMouseCoordinate).not.toHaveBeenCalled();
    });

    it('draw(...) should update the current command style', () => {
        service['isClick'] = true;
        const newCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [],
            style: {} as StrokeStyle,
        };
        service['currentCommand'] = newCommand;
        const newPencil: Pencil = {
            color: 'orange',
            cap: 'round',
            width: { pencil: 1, eraser: 3 },
            state: Tool.Pencil,
        };
        service['pencil'] = newPencil;
        service.draw({} as MouseEvent);
        expect(service['currentCommand'].style.color).toBe(newPencil.color);
        expect(service['currentCommand'].style.cap).toBe(newPencil.cap);
        expect(service['currentCommand'].style.width).toBe(newPencil.width.pencil);
        expect(service['currentCommand'].style.destination).toBe('source-over');
    });

    it('draw(...) should create a stroke', () => {});

    it('draw(...) should update the image', () => {});
});

/*
    draw(event: MouseEvent) {
        if (!this.isClick) return;
        const line = this.updateMouseCoordinates(event);
        this.updateCurrentCommand(line);
        this.createStroke(line, this.currentCommand.style);
        this.updateImages();
    }

    private updateCurrentCommand(line: Line) {
        this.currentCommand.strokes[0].lines.push(line);
        this.currentCommand.style = {
            color: this.pencil.color,
            cap: this.pencil.cap,
            width: this.pencil.state === Tool.Pencil ? this.pencil.width.pencil : this.pencil.width.eraser,
            destination: this.pencil.state === Tool.Pencil ? 'source-over' : 'destination-out',
        };
    }

    */
