// https://stackoverflow.com/questions/3422673/how-to-evaluate-a-math-expression-given-in-string-form

// GRAMMAR:
// expression = term | expression '+' term | expression '-' term
// term       = factor | term '*' factor | term '/' factor
// factor     = number | π | e | '-' factor | '+' factor | factor '^' factor | '(' expression ')' | <func> factor | '|' expresion '|' | ANS

class MathExpressionEvaluator {

    constructor(input, lastAnswer) {
        this.input = input;
        this.lastAnswer = lastAnswer;

        this.currentChar = -1
        this.currentPos = -1;

        this.error = '';
    }


    nextChar() {
        this.currentPos++;
        this.currentChar = this.currentPos < this.input.length ? this.input.charCodeAt(this.currentPos) : -1;
    }

    consumeIfMatch(charToCheck) {
        while (this.currentChar === ' '.charCodeAt(0)) this.nextChar();

        if (this.currentChar === charToCheck.charCodeAt(0)) {
            this.nextChar();
            return true;
        }

        return false;
    }

    parse() {
        this.nextChar();
        let x = this.parseExpression();

        if (this.currentPos < this.input.length)
            this.error = 'Unexpected: ' + String.fromCharCode(this.currentChar);

        return {value: x, error: this.error};
    }

    parseExpression() {
        let x = this.parseTerm();

        while (true) {
            if (this.consumeIfMatch('+'))
                x += this.parseTerm();
            else if (this.consumeIfMatch('-'))
                x -= this.parseTerm();
            else
                return x;
        }
    }

    parseTerm() {
        let x = this.parseFactor();

        while (true) {
            if (this.consumeIfMatch('*'))
                x *= this.parseFactor();
            else if (this.consumeIfMatch('/'))
                x /= this.parseFactor();
            else
                return x;
        }
    }

    parseFactor() {
        if (this.consumeIfMatch('+'))
            return this.parseFactor();
        else if (this.consumeIfMatch('-'))
            return -this.parseFactor();


        let x;
        let startPos = this.currentPos;

        if (this.consumeIfMatch('(')) {
            x = this.parseExpression()
            this.consumeIfMatch(')')

        } else if (this.consumeIfMatch('|')) {
            x = Math.abs(this.parseExpression());
            this.consumeIfMatch('|')

        } else if (this.consumeIfMatch('π')) {
            x = Math.PI;

        } else if (this.consumeIfMatch('e')) {
            x = Math.E;

        } else if ((this.currentChar >= '0'.charCodeAt(0) && this.currentChar <= '9'.charCodeAt(0)) || this.currentChar === '.'.charCodeAt(0)) {
            while ((this.currentChar >= '0'.charCodeAt(0) && this.currentChar <= '9'.charCodeAt(0)) || this.currentChar === '.'.charCodeAt(0))
                this.nextChar();

            x = Number(this.input.substring(startPos, this.currentPos));

        } else if ((this.currentChar >= 'A'.charCodeAt(0) && this.currentChar <= 'Z'.charCodeAt(0)) ||
            (this.currentChar >= 'a'.charCodeAt(0) && this.currentChar <= 'z'.charCodeAt(0))) {

            while ((this.currentChar >= 'A'.charCodeAt(0) && this.currentChar <= 'Z'.charCodeAt(0)) ||
            (this.currentChar >= 'a'.charCodeAt(0) && this.currentChar <= 'z'.charCodeAt(0)))
                this.nextChar();

            let func = this.input.substring(startPos, this.currentPos);

            if (func === 'ANS')
                x = this.lastAnswer;
            else {
                x = this.parseFactor();

                if (func === 'sin')
                    x = Math.sin(this.toRadians(x));
                else if (func === 'cos')
                    x = Math.cos(this.toRadians(x));
                else if (func === 'tan')
                    x = Math.tan(this.toRadians(x));
                else if (func === 'asin')
                    x = this.toDegree(Math.asin(x));
                else if (func === 'acos')
                    x = this.toDegree(Math.acos(x));
                else if (func === 'atan')
                    x = this.toDegree(Math.atan(x));
                else if (func === 'sqrt')
                    x = Math.sqrt(x);
                else if (func === 'log')
                    x = Math.log10(x);
                else if (func === 'ln')
                    x = Math.log(x);
                else
                    this.error = 'Unknown function: ' + func;
            }
        } else
            this.error = 'Unexpected: ' + String.fromCharCode(this.currentChar);

        if (this.consumeIfMatch('^'))
            x = Math.pow(x, this.parseFactor());

        return x;
    }

    toRadians(deg) {
        return deg / 360 * 2 * Math.PI;
    }

    toDegree(rad) {
        return rad / (2 * Math.PI) * 360;
    }
}
