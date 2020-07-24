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
                    this.output = this.input;
                    break;
                default:
                    this.input += button;
            }
        }
    }
})
