import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ToolBoxComponent } from '@app/components/tool-box/tool-box.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { AppComponent } from '@app/pages/app/app.component';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { ExitGameButtonComponent } from './components/exit-game-button/exit-game-button.component';
import { CluesAreaComponent } from './components/clues-area/clues-area.component';
import { TimerCountdownComponent } from './components/timer-countdown/timer-countdown.component';
import { TimerStopwatchComponent } from './components/timer-stopwatch/timer-stopwatch.component';
import { DifferencesAreaComponent } from './components/differences-area/differences-area.component';
import { GameSelectionPageComponent } from './pages/game-selection-page/game-selection-page.component';
import { DialogUploadFormComponent } from './components/dialog-upload-form/dialog-upload-form.component';
import { DialogResetComponent } from './components/dialog-reset/dialog-reset.component';
import { DialogCreateGameComponent } from './components/dialog-create-game/dialog-create-game.component';
/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        CreateGamePageComponent,
        DrawCanvasComponent,
        ToolBoxComponent,
        DialogFormsErrorComponent,
        GameSelectionPageComponent,
        AdminPageComponent,
        DialogUploadFormComponent,
        DialogResetComponent,
        PlayAreaComponent,
        ExitGameButtonComponent,
        CluesAreaComponent,
        TimerCountdownComponent,
        TimerStopwatchComponent,
        DifferencesAreaComponent,
        DialogCreateGameComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
