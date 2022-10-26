import { Service } from "typedi";

@Service()
export class TimerService {
    private initialTime : Date
    seconds:number


    constructor() {}

    setTimer(){
        this.initialTime = new Date();
    }

    calculateTime(){
        const presentTime = new Date();
        this.seconds = (presentTime.getTime() - this.initialTime.getTime()) / 1000;
    }
}