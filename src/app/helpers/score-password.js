/**
 * Calculates a score to quantify password strength.
 *
 * Score < 60: weak password, should not be allowed
 * Score >= 60: still weak, can be sufficient (e.g. 8 characters, mixed lower/upper case, numbers)
 * Score >= 80: strong password
 *
 * @param password
 * @returns {number}
 */
export default (password) => {
    let score = 0;
    if (!password) {
        return score;
    }

    // award every unique letter until 5 repetitions
    const letters = {};
    for (let i = 0; i < password.length; i++) {
        letters[password[i]] = (letters[password[i]] || 0) + 1;
        score += 5.0 / letters[password[i]];
    }

    // bonus points for mixing it up
    const variations = {
        digits: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        nonWords: /\W/.test(password)
    };

    let variationCount = 0;
    for (let check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0;
    }

    score += (variationCount - 1) * 10;

    return Math.floor(score);
}
