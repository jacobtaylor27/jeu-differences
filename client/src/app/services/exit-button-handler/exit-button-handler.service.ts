import { Injectable } from '@angular/core';
import { Pages } from '@app/interfaces/pages';

@Injectable({
    providedIn: 'root',
})
export class ExitButtonHandlerService {
    currentPage : Pages;


    setGamePage(): void {
        this.currentPage = {Game : true, CreateGame : false, WaitingRoom : false}
    }
    
    setCreateGamePage(): void {
        this.currentPage = {Game : false, CreateGame : true, WaitingRoom : false}
    }

    setWaitingRoom(): void {
        this.currentPage = {Game : false, CreateGame : false, WaitingRoom : true}
    }

    getMessage(): string {
        if(this.currentPage.Game){
            return 'Quitter la partie ?'
        }

        else if(this.currentPage.CreateGame){
            return 'Quitter la création ?'
        }

        else if(this.currentPage.WaitingRoom){
            return "Quitter la salle d'attente ? "
        }

        return ''; 
    }
}
