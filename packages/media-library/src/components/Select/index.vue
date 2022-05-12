<template>
    <div>
        <div class="row media-library-header">
            <div class="col-7">
                <button class="btn-light mr-10 btn-round">
                    <i class="fas fa-home"></i>
                </button>

                <select-directory v-model="currentDirectory"></select-directory>

                <button @click="uploadFiles" class="btn-light ml-10">
                    <i class="fas fa-cloud-upload-alt"></i>&nbsp;
                    Upload Files
                </button>
            </div>
            <div class="col-5 align-right">
                <input type="text" placeholder="Search in folder..." v-model="search" @input="filter">

                <button @click="addDirectory" class="btn-light ml-10">
                    <i class="fas fa-folder-plus"></i>
                </button>
            </div>
            <hr class="col-12">
        </div>
        <div class="row">
            <div class="col-8">

                <directory-select :directories="directories" @changed="createOrUpdateDirectory"></directory-select>

                <image-select :files="selectableFiles"></image-select>

                <!--<empty-directory v-if="!loading && noFiles && noDirectories"></empty-directory>-->
            </div>
            <div v-if="selectedFile" class="col-4">
                <file-info :file="selectedFile" @reload="getFilesAndDirectories" @finally-selected="finallySelected"></file-info>
            </div>

            <div v-else class="col-4">
                <directory-info :dir="currentDirectory ? directory : null"></directory-info>
            </div>
        </div>
    </div>
</template>

<script>
    import ImageSelect from "./components/ImageSelect/index";
    import DirectorySelect from "./components/DirectorySelect/index";
    import EmptyDirectory from "./components/EmptyDirectory";
    import FileInfo from "./components/FileInfo";
    import SelectDirectory from "./components/SelectDirectory";
    import CurrentDirectoryMixin from "Mixins/CurrentDirectory"
    import CurrentUploadDirectoryMixin from "Mixins/CurrentUploadDirectory"
    import AxiosInstanceMixin from "Mixins/AxiosInstance"
    import SelectedFileMixin from "Mixins/SelectedFile"
    import DirectoriesTreeMixin from "Mixins/DirectoriesTree"
    import DirectoryInfo from "./components/DirectoryInfo";

    export default {
        name: "select-file",

        mixins: [
            CurrentDirectoryMixin,
            CurrentUploadDirectoryMixin,
            AxiosInstanceMixin,
            SelectedFileMixin,
            DirectoriesTreeMixin
        ],

        components: {
            DirectoryInfo,
            SelectDirectory,
            FileInfo,
            EmptyDirectory,
            DirectorySelect,
            ImageSelect
        },

        props: {
            allowedMimes: {
                type: Array,
                default: null
            }
        },

        data: () => ({
            loading: true,
            search: "",
            files: [],
            directories: [],
            directory: {},
            selectableFiles: [{name: ""}]
        }),

        computed: {
            noFiles() {
                return this.files.length === 0
            },
            noDirectories() {
                return this.directories.length === 0
            }
        },

        async created() {
            await this.reloadTree()
            this.getFilesAndDirectories()
        },

        methods: {
            async getFilesAndDirectories() {
                this.loading = true

                const files = this.getFiles()
                const directories = this.getDirectories()

                await [files, directories]
                this.loading = false

                let tree = this.getDirectoriesTree()
                for(let i in tree)
                {
                    if (tree[i].uuid === this.currentDirectory)
                    {
                        this.directory = tree[i]
                    }
                }
            },
            async getDirectories() {
                const response = await this.axios.get('media/directories/' + (this.currentDirectory || ''))
                this.directories = response.data.data
            },
            async getFiles() {
                let url = 'media/directories/' + (this.currentDirectory || 'root') + '/files'

                if (this.allowedMimes)
                {
                    url += '?mimes=' + encodeURI(this.allowedMimes.join())
                }

                const response = await this.axios.get(url)
                this.files = response.data.data
                this.selectableFiles = this.files
            },
            filter() {
                this.selectableFiles = this.files.filter(item => {
                    return item.name.toLowerCase().includes(this.search.toLowerCase())
                })
            },
            addDirectory() {
                this.directories.push({
                    id: null,
                    name: "new directory",
                    _editable: true
                })
            },
            async createOrUpdateDirectory(dir) {
                if (dir.hasOwnProperty('uuid')) {
                    const response = await this.axios.put(`media/directories/${dir.uuid}`, dir)
                } else {
                    if (this.currentDirectory) {
                        dir.uuid = this.currentDirectory
                    }
                    const response = await this.axios.post('media/directories', dir)
                }

                this.reloadTree()
                this.getFilesAndDirectories()
            },
            uploadFiles() {
                this.setCurrentUploadDirectory(this.currentDirectory)
                this.$emit('upload')
            },
            async deleteDirectory() {
                await this.axios.delete('media/directories/' + this.currentDirectory)
                this.currentDirectory = null
                this.getFilesAndDirectories()
            },
            async finallySelected(file) {
                this.$emit('finally-selected', file);
            }
        },

        watch: {
            currentDirectory() {
                this.selectedFile = null
                this.getFilesAndDirectories()
            }
        }
    }
</script>
