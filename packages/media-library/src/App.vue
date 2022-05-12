<template>
    <div id="app" >
        <b-tabs @input="tabChanged" v-model="currentTab">
            <b-tab>
                <upload-file @uploaded="fileUploaded"></upload-file>
            </b-tab>

            <b-tab>
                <select-file ref="select" @upload="openUploadTab" :allowed-mimes="allowedMimes" @finally-selected="finallySelectedFile"></select-file>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import SelectFile from "./components/Select/index";
    import UploadFile from "./components/Upload/index";
    import BTabs from 'bootstrap-vue/es/components/tabs/tabs'
    import BTab from 'bootstrap-vue/es/components/tabs/tab'
    import Axios from 'axios'

    export default {
        name: 'app',

        provide() {
            return {
                getCurrentDirectory: this.getCurrentDirectory,
                setCurrentDirectory: this.setCurrentDirectory,
                getCurrentTab: this.getCurrentTab,
                setCurrentTab: this.setCurrentTab,
                getCurrentUploadDirectory: this.getCurrentUploadDirectory,
                setCurrentUploadDirectory: this.setCurrentUploadDirectory,
                setSelectedFile: this.setSelectedFile,
                getSelectedFile: this.getSelectedFile,
                getDirectoriesTree: this.getDirectoriesTree,
                setDirectoriesTree: this.setDirectoriesTree,
                getAxiosInstance: this.getAxiosInstance,
                setAxiosInstance: this.setAxiosInstance
            }
        },

        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            open: {
                type: Boolean,
                default: true
            },
            apiBaseUrl: {
                type: String,
                default: "http://api.airlst.local/api"
            },
            authToken: {
                type: String,
                default: ""
            },
            startDirectoryUuid: {
                type: String
            },
            allowedMimes: {
                type: Array,
                default: null
            }
        },

        components: {
            UploadFile,
            SelectFile,
            BTabs,
            BTab
        },

        data: () => ({
            axios: null,
            selectedFile: null,
            currentDirectory: null,
            currentUploadDirectory: null,
            directoriesTree: null,
            currentTab: 1
        }),

        computed: {
            hasSelectedFile() {
                return this.selectedFile && this.selectedFile.hasOwnProperty('uuid')
            }
        },

        created() {
            this.configAxios()

            if(this.startDirectoryUuid)
            {
                this.currentDirectory = this.startDirectoryUuid
            }
        },

        methods: {
            getCurrentDirectory()
            {
                return this.currentDirectory
            },
            setCurrentDirectory(v)
            {
                this.currentDirectory = v
            },
            getCurrentTab()
            {
                return this.currentTab
            },
            setCurrentTab(v)
            {
                this.currentTab = v
            },
            getCurrentUploadDirectory()
            {
                return this.currentUploadDirectory
            },
            setCurrentUploadDirectory(v)
            {
                this.currentUploadDirectory = v
            },
            getSelectedFile()
            {
                return this.selectedFile
            },
            setSelectedFile(v)
            {
                this.selectedFile = v
            },
            getDirectoriesTree()
            {
                return this.directoriesTree
            },
            setDirectoriesTree(v)
            {
                this.directoriesTree = v
            },
            getAxiosInstance()
            {
                return this.axios
            },
            setAxiosInstance(v)
            {
                this.axios = v
            },
            tabChanged()
            {
                this.selectedFile = null
            },
            fileUploaded(file) {
                this.selectedFile = Array.isArray(file) ? file[0] : file
                this.$refs['select-tab'].click()
            },
            cancel() {
                this.$emit('cancel')
            },
            ok() {
                this.$emit('ok')
            },
            configAxios() {
                this.axios = Axios.create({
                    headers: {
                        Authorization: 'Bearer ' + this.authToken
                    },
                    baseURL: this.apiBaseUrl
                })
            },
            openUploadTab()
            {
                this.currentTab = 0
            },
            finallySelectedFile(file) {
                this.$emit('selected', file);
            }
        },
        watch: {
            selectedFile(file)
            {
                /*this.$emit('selected', file)*/
            },
            currentTab(val)
            {
                if (val == 1)
                {
                    this.$refs.select.getFilesAndDirectories()
                }
            }

        }
    }
</script>

<style lang="scss">
    /*@import "~bootstrap/scss/functions";*/
    /*@import "~bootstrap/scss/mixins";*/
    /*@import "~bootstrap/scss/variables";*/
    /*@import "~bootstrap/scss/grid";*/
    /*@import "~bootstrap/scss/utilities";*/
    /*@import "~bootstrap/scss/progress";*/
    /*@import "~bootstrap/scss/nav";*/
    /*@import '~bootstrap-vue/src/variables';*/
    /*@import '~bootstrap-vue/src/utilities';*/
    /*@import '~bootstrap-vue/src/components/index';*/
</style>
