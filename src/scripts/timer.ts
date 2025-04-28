export class Timer {
    private timerElement: HTMLHeadingElement;
    private intervalId: number | undefined;

    constructor() {
        this.timerElement = document.createElement("h3");
        this.timerElement.classList.add("timer");
    };

    start() {
        this.timerElement.innerHTML = "0s";
        let seconds = 0;

        this.intervalId = setInterval(() => {
            seconds++;
            let h = Math.floor(seconds / 3600);
            let min = Math.floor((seconds % 3600) / 60);
            let s = (seconds % 3600) % 60;
            let time = seconds >= 3600 ? `${h}h ` : "";
            time += seconds >= 60 ? `${min}min ${s}s` : `${s}s`
            this.timerElement.innerHTML = time;
        }, 1000);
    }
    
    stop() {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }

    get element() {
        return this.timerElement;
    }
}
