export default {

    inject: [
        'setCurrentDirectory',
        'getCurrentDirectory'
    ],

    computed: {
        currentDirectory: {
            get() {
                return this.getCurrentDirectory()
            },
            set(v) {
                return this.setCurrentDirectory(v)
            }
        }
    }

}
