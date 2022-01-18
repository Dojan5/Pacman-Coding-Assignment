export class ScoreHandler {
    constructor(initialScore: number = 1000, reductionInterval: 500) {
        this.score = initialScore;
        this.timer = this.startTimer(reductionInterval);
    }
    score: number;
    timer:NodeJS.Timer;

    calculateFinalScore(): number {
        this.stopTimer();
        return this.score;
    }

    private stopTimer() {
        clearInterval(this.timer as NodeJS.Timer);
    }

    private startTimer(interval: number): NodeJS.Timer {
        return setInterval(() => this.change(-1), interval);
    }

    change(value: number) {
        console.log("Score: " + this.score);
        this.score += value;
    } 

}