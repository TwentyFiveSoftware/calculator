const app = new Vue({
    el: '.calculator',
    data: {
        input: '1234,5 + 0,5',
        output: '1235'
    },
    methods: {
        clickButton(button) {
            console.log(button)
        }
    }
})
