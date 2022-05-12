<template>
    <div>
        <div class="row" v-if=" ! hasUploadingFiles">
            <div class="row control-bar">
                <div class="col">
                    <select-directory v-model="currentUploadDirectory"></select-directory>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <input type="file" @input="startUpload" ref="file-input" multiple style="display: none">
                    <button class="thumbnail-wrapper" @click="$refs['file-input'].click()">
                        <div class="icon-wrapper">
                            <div class="fas fa-mouse-pointer"></div>
                            <p>Select files</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div class="row" v-if="hasUploadingFiles">
            <div class="col">
                <template v-for="file in files">
                    <uploading-file :file="file" :directory="uploadDirectory"></uploading-file>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import UploadingFile from "./components/UploadingFile";
    import CurrentUploadDirectoryMixin from "Mixins/CurrentUploadDirectory"
    import DirectoriesTreeMixin from "Mixins/DirectoriesTree"
    import SelectDirectory from "../Select/components/SelectDirectory";
    import CurrentTabMixin from "Mixins/CurrentTab";
    import CurrentDirectoryMixin from "Mixins/CurrentDirectory";

    export default {
        name: "upload-file",

        components: {
            UploadingFile,
            SelectDirectory
        },

        mixins: [
            CurrentUploadDirectoryMixin,
            DirectoriesTreeMixin,
            CurrentTabMixin,
            CurrentDirectoryMixin
        ],

        data: () => ({
            files: [],
            uploadStarted: false
        }),

        created()
        {
            this.reloadTree()
        },

        computed: {
            hasUploadingFiles()
            {
                return this.files.length > 0
            },
            uploadDirectory()
            {
                return this.getCurrentUploadDirectory()
            }
        },

        methods: {
            open()
            {
                this.$refs['upload-input'].click()
            },
            startUpload(e)
            {
                this.currentDirectory = null
                this.files = Array.from(e.target.files)
                this.uploadStarted = true
            }
        },
        watch: {
            hasUploadingFiles(val)
            {
                // uploadStarted === true and there are no files left
                // upload is finished
                if( ! val && this.uploadStarted)
                {
                    // change tab to file explorer and
                    // current directory to the uploadDirectory
                    this.currentTab = 1;
                    this.currentDirectory = this.uploadDirectory
                }
            }
        }
    }
</script>

<style lang="scss">
    button.upload {
        font-size: 28px;
        height: 46px;
        line-height: 44px;
        padding: 0 36px;
        border: 1px solid #5b626b;

        &:hover {
            border: 1px solid #8b5ed9;
        }
    }
</style>
