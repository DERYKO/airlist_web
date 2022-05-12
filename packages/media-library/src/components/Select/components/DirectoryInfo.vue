<template>
    <div style="position: sticky;top:30px" class="card">
        <h3>Details&nbsp;&nbsp;&nbsp;<i class="fas fa-folder"></i></h3>

        <template v-if="hasUuid">
            <table>
                <tr>
                    <td>Name:</td>
                    <td>{{dir.name }}</td>
                </tr>
                <tr>
                    <td>Added-at:</td>
                    <td>{{dir.created_at.date || ''}}</td>
                </tr>
            </table>

            <h3 class="mt-30">Aktionen</h3>
            <button @click="deleteDir" class="btn-delete btn-block">
                <i class="fal fa-trash-alt"></i> Delete
            </button>
        </template>

        <template v-else>
            <table>
                <tr>
                    <td>Name:</td>
                    <td>Main-Directory</td>
                </tr>
            </table>
        </template>

    </div>
</template>

<script>
    import AxiosInstanceMixin from "Mixins/AxiosInstance";
    import CurrentDirectoryMixin from "Mixins/CurrentDirectory";

    export default {
        name: "directory-info",

        mixins: [
            AxiosInstanceMixin,
            CurrentDirectoryMixin
        ],

        props: {
            dir: {

            }
        },

        computed: {
            hasUuid()
            {
                return this.dir && this.dir.hasOwnProperty('uuid') && this.dir.uuid
            }
        },

        methods: {
            async deleteDir()
            {
                await this.axios.delete('media/directories/' + this.dir.uuid)
                this.currentDirectory = null
                this.$emit('reload')
            }
        }
    }
</script>
