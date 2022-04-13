export function check(word, guess) {
    const wordArray = word.split('');
    const guessArray = guess.split('');

    const yellowed = [];
    const statusArray = [0,0,0,0,0];

    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === guessArray[i]) {
            statusArray[i] = 2;
            wordArray.splice(i, 1, 0);
        }
    }
    for (let i = 0; i < wordArray.length; i++) {
        if (statusArray[i] !== 2) {
            if (wordArray.includes(guessArray[i]) && !yellowed.includes(guessArray[i])) {
                statusArray[i] = 1;
                yellowed.push(guessArray[i]);
            } else {
                statusArray[i] = 0;
            }
        }
    }
    return statusArray;
}
export function eloCalc(playerOne, playerTwo) {
    const kFactor = 32;
    const rating1 = Math.pow(10, (playerOne.elo / 400));
    const rating2 = Math.pow(10, (playerTwo.elo / 400));
    const prob = rating1 / (rating1 + rating2);
    
    const ratingChange = (playerOne.elo + kFactor * (playerOne.score - prob)) - playerOne.elo;
    console.log(ratingChange)
    return ratingChange;
}