export default {

    inject: [
        'setAxiosInstance',
        'getAxiosInstance'
    ],

    computed: {
        axios: {
            get() {
                return this.getAxiosInstance()
            },
            set(v) {
                return this.setAxiosInstance(v)
            }
        }
    }

}
