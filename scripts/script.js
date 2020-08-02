new Vue({
    el: '.calculator',
    data: {
        input: '',
        output: ''
    },
    methods: {
        clickButton(button) {
            switch (button) {
                case 'AC':
                    this.input = '';
                    this.output = '';
                    break;
                case '=':
                    this.evaluateInput();
                    break;
                default:
                    this.input += button;
            }
        },
        evaluateInput() {
            let result = (new MathExpressionEvaluator(this.input)).parse();

            if (result.error !== '') {
                this.output = result.error;
                return;
            }

            let value = result.value;

            // CAP OUTPUT TO 5 FRACTION DIGITS
            let split = value.toString().split('.');
            if (split.length > 1)
                if (split[1].length > 5)
                    value = split[0] + '.' + split[1].substr(0, 5);

            value = Number(value);

            // REPLACE '.' WITH ','
            value = value.toString();
            value = value.replace(/\./g, ',')

            this.output = value;
        },
        handleKeyPress(event) {
            if (event.key === 'Enter' || event.key === '=') {
                this.clickButton('=');
                return;
            }

            if (event.key.charCodeAt(0) === 68) { // ^
                this.clickButton('^');
                return;
            }

            if (event.key.charCodeAt(0) === 66) { // RETURN
                if (this.input.length > 0)
                    this.input = this.input.substr(0, this.input.length - 1);
                return;
            }

            console.log(event.key.charCodeAt(0))

            if (event.key.length > 1) return;

            let key = event.key.charCodeAt(0);

            if ((key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0)) ||
                (key >= 'a'.charCodeAt(0) && key <= 'z'.charCodeAt(0)) ||
                (key >= '('.charCodeAt(0) && key <= '/'.charCodeAt(0)))
                this.clickButton(event.key.replace(/,/g, '.'));
        }
    },
    computed: {
        formattedInput() {
            return this.input
                .replace(/\//g, '÷')
                .replace(/\*/g, '×')
                .replace(/\./g, ',');
        }
    },
    mounted() {
        window.addEventListener('keypress', this.handleKeyPress);
    }
})
