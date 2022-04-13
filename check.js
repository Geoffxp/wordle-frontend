const check = (word, guess) => {
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