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
        }
    },
    computed: {
        formattedInput() {
            return this.input
                .replace(/\//g, '÷')
                .replace(/\*/g, '×')
                .replace(/\./g, ',');
        }
    }
})
