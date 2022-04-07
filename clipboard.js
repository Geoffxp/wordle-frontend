export function copyText() {
    let outputString = '';
    const clipboardCode = localStorage.getItem('clipboardCode');
    const clipArray = clipboardCode.split(' ');
    const totalGuess = localStorage.getItem('guesses').split(' ').length - 1;
    outputString += `Gordle # - ${totalGuess}/6\n`;
    clipArray.forEach((code, index) => {
        if (code == 0) {
            outputString += '\u2B1C'
        } else if (code == 1) {
            outputString += '\uD83D\uDFE8'
        } else if (code == 2) {
            outputString += '\uD83D\uDFE9'
        }
        if ((index + 1) % 5 === 0) outputString += '\n'
    })
  
    navigator.clipboard.writeText(outputString);
}
