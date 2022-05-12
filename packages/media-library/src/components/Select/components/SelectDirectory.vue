<template>
    <select name="folder" id="folder-select" :value="value" @input="input">
        <option value="">Main-Directory</option>
        <option v-for="directory,index in tree" :key="index" :value="directory.uuid">
            {{ directory.name }}
        </option>
    </select>
</template>

<script>
    import DirectoriesTreeMixin from "Mixins/DirectoriesTree"

    export default {
        name: "select-directory",

        mixins: [
            DirectoriesTreeMixin
        ],

        computed: {
            tree()
            {
                // ToDo
                return this.getDirectoriesTree()
            }
        },

        props: {
            value: {
                type: String,
                default: null
            }
        },

        methods: {
            input(e)
            {
                this.$emit('input', e.target.value)
            }
        }
    }
</script>
