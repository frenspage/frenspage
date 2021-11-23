export default class Randomizer {

    public static randomNumber(min:number = 0, max: number = 100){
        return Math.floor(Math.random() * (max-min + 1))+ min;
    }
    
}
