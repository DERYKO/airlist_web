<template>
    <div style="position: sticky;top:30px" class="card">
        <h3>Details</h3>
        <div class="align-center">
            <img class="img-responsive" :src="file.url" alt="">
        </div>
        <table class="mt-20">
            <tr>
                <td>Name:</td>
                <td>{{file.name}}</td>
            </tr>
            <tr>
                <td>Size:</td>
                <td>{{filesize}}</td>
            </tr>
            <tr>
                <td>Added-at:</td>
                <td>{{file.created_at}}</td>
            </tr>
        </table>

        <h3 class="mt-30">Move to:</h3>
        <div class="move-file">
            <select-directory v-model="moveTo"></select-directory>
            <button @click="move">
                <i class="fas fa-arrow-square-right"></i>
            </button>
        </div>

        <h3 class="mt-30">Aktionen</h3>
        <button @click="deleteFile" class="btn-delete btn-block">
            <i class="fal fa-trash-alt"></i> Delete
        </button>

        <button @click="finallySelectFile" class="btn-confirm btn-block mt-20">
            <i class="fas fa-mouse-pointer"></i> Select
        </button>

    </div>
</template>

<script>
    import SelectDirectory from "./SelectDirectory";
    import AxiosInstanceMixin from "Mixins/AxiosInstance";
    import SelectedFileMixin from "Mixins/SelectedFile"

    export default {
        name: "file-info",
        components: {SelectDirectory},

        mixins: [
            AxiosInstanceMixin,
            SelectedFileMixin
        ],

        props: {
            file: {
                type: Object
            }
        },

        data: () => ({
            moveTo: null
        }),

        computed: {
            filesize()
            {
                let bytes = this.file.size
                if (bytes == 0) return '0 Bytes';
                const k = 1024; const dm = 2;

                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
            },
        },

        methods: {
            async deleteFile()
            {
                await this.axios.delete('media/files/' + this.file.uuid)

                if (this.selectedFile.uuid === this.file.uuid)
                {
                    this.selectedFile = null
                }

                this.$emit('reload')
            },
            async finallySelectFile()
            {
                this.$emit('finally-selected', this.file);
            },
            async move()
            {
                const response = await this.axios.put('media/files/' + this.file.uuid, {
                    uuid: this.file.uuid,
                    moveTo: this.moveTo
                })

                this.selectedFile = null
                this.$emit('reload')
            }
        }
    }
</script>
