function factorial(n) {
    if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
        console.log("Invalid input: Please enter a non-negative integer.");
        return null;
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

const number = 6;
console.log(`The factorial of ${number} is ${factorial(number)}`);