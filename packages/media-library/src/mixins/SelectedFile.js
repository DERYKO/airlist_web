export default {

    inject: [
        'setSelectedFile',
        'getSelectedFile'
    ],

    computed: {
        selectedFile: {
            get() {
                return this.getSelectedFile()
            },
            set(v) {
                return this.setSelectedFile(v)
            }
        }
    }

}
