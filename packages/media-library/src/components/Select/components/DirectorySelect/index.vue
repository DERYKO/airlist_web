<template>
    <ul class="image-thumbnail-list row">
        <li v-for="dir in directories" @click="clicked(dir)" class="col-3">
            <directory-thumbnail :directory="dir" @changed="changed"></directory-thumbnail>
        </li>
    </ul>
</template>

<script>
    import DirectoryThumbnail from "./thumbnail";
    import CurrentDirectoryMixin from "Mixins/CurrentDirectory"

    export default {
        name: "directory-select",
        components: {
            DirectoryThumbnail
        },

        mixins: [
            CurrentDirectoryMixin
        ],

        props: {
            directories: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            changed(e)
            {
                this.$emit('changed', e)
            },
            clicked(dir)
            {
                if (this.isEditable(dir))
                {
                    return;
                }

                this.currentDirectory = dir.uuid
            },
            isEditable(dir)
            {
                return dir.hasOwnProperty('_editable') && dir._editable
            }
        }
    }
</script>
