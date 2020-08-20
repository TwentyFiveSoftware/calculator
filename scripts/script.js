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
                    if (this.input.length > 0)
                        this.evaluateInput();
                    break;
                case '<-':
                    if (this.input.length > 0)
                        this.input = this.input.substr(0, this.input.length - 1);

                    this.output = '';
                    break;
                default:
                    if (this.output.length > 0) {
                        this.input = '';
                        this.output = '';
                    }

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

            if(value.toString().length > 10)
                value = Number(value).toFixed(10);

            value = Number(value);

            // REPLACE '.' WITH ','
            value = value.toString();
            value = value.replace(/\./g, ',')

            this.output = value;
        },
        handleKeyDown(event) {
            if (event.key === 'Enter' || event.key === '=') {
                this.clickButton('=');
                return;
            }

            if (event.key === 'Escape') {
                this.clickButton('AC');
                return;
            }

            if (event.key.charCodeAt(0) === 68) { // ^
                this.clickButton('^');
                return;
            }

            if (event.key.charCodeAt(0) === 66) { // RETURN
                this.clickButton('<-');
                return;
            }

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
        window.addEventListener('keydown', this.handleKeyDown);
    }
})
