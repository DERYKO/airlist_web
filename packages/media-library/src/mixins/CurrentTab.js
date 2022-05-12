export default {

    inject: [
        'setCurrentTab',
        'getCurrentTab'
    ],

    computed: {
        currentTab: {
            get() {
                return this.getCurrentTab()
            },
            set(v) {
                return this.setCurrentTab(v)
            }
        }
    }

}
