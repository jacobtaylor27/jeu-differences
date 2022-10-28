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

    getTitle(): string {
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

    getMessage() : string {
        if(this.currentPage.WaitingRoom){
            return 'Êtes-vous certain de vouloir quitter ? Vous serez redirigés vers la page de sélection de jeu.'
        }

        return 'Êtes-vous certain de vouloir quitter ? Votre progrès ne sera pas sauvegardé.'
    }
}
