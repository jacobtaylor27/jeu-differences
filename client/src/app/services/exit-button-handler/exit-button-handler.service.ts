import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExitButtonHandlerService {

  isOnGamePage: boolean;
  constructor() { }

  public setCreateGamePage() : void{
    this.isOnGamePage = false;
  }

  public setGamePage() : void{
    this.isOnGamePage = true;
  }
  
  public getMessages(): string{
    return this.isOnGamePage ? "Quitter la partie ? " : "Quitter la création ?"
  }
}
