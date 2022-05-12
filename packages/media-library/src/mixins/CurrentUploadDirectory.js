export default {

    inject: [
        'setCurrentUploadDirectory',
        'getCurrentUploadDirectory'
    ],

    computed: {
        currentUploadDirectory: {
            get() {
                return this.getCurrentUploadDirectory()
            },
            set(v) {
                return this.setCurrentUploadDirectory(v)
            }
        }
    }

}
