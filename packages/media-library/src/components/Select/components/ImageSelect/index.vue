<template>
    <ul class="image-thumbnail-list row">
        <li v-for="file in files" @click="toggleSelect(file)" class="col-3">
            <image-thumbnail :file="file" :selected="selectedFile === file"></image-thumbnail>
        </li>
    </ul>
</template>

<script>
    import ImageThumbnail from "./thumbnail";
    import SelectedFileMixin from "Mixins/SelectedFile"

    export default {
        name: "image-select",
        components: {ImageThumbnail},

        mixins: [
            SelectedFileMixin
        ],

        props: {
            files: {
                type: Array,
                default: () => []
            }
        },

        methods: {
            toggleSelect(file)
            {
                this.selectedFile = (file === this.selectedFile) ? null : file
            }
        }
    }
</script>
