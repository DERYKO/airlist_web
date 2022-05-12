<template>
    <div class="row mt-2">
        <div class="col">
            <img class="thumbnail" :src="preview" alt="">
        </div>

        <div class="col">
            <div class="row">
                <div class="col">
                    Name: {{file.name}}
                </div>
                <div class="col text-right">
                    Size: {{size}}
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <b-progress :value="progressEvent.loaded" :max="progressEvent.total" animated></b-progress>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BProgress from 'bootstrap-vue/es/components/progress/progress'
    import BProgressBar from 'bootstrap-vue/es/components/progress/progress-bar'
    import AxiosInstanceMixin from "Mixins/AxiosInstance"

    export default {
        name: "uploading-file",

        components: {
            BProgress,
            BProgressBar
        },

        mixins: [
            AxiosInstanceMixin
        ],

        props: {
            file: {
                type: File,
                default: null
            },
            directory: {
                type: String,
                default: ''
            }
        },

        data: () => ({
            preview: "",
            progressEvent: {
                total: 100,
                loaded: 0
            }
        }),

        created()
        {
            this.upload()
            this.renderPreview()
        },

        computed: {
            size()
            {
                let bytes = this.file.size
                if (bytes == 0) return '0 Bytes';
                const k = 1024; const dm = 2;
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
            }
        },

        methods: {
            renderPreview()
            {
                var reader = new FileReader();
                reader.readAsDataURL(this.file);
                reader.onload = function(e) {
                    this.preview = e.target.result
                }.bind(this)
            },
            async upload() {
                let formData = new FormData();
                formData.append('file', this.file);

                const response = await this.axios.post('media/files/' + (this.directory || ''), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: progressEvent => this.progressEvent = progressEvent
                })

                if (response.status === 200)
                {
                    this.$parent.files.splice(this.$parent.files.indexOf(this.file), 1)
                }
            }
        }
    }
</script>

<style scoped>
    .thumbnail {
        display: block;
        float: left;
        width: 75px;
        height: 75px;
        object-fit: cover;
    }
</style>
