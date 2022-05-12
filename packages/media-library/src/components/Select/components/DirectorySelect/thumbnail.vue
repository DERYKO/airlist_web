<template>
    <div class="thumbnail-wrapper" ref="wrapper">
        <input type="text" v-model="dir.name" v-if="isEditable" @keyup.enter="update" ref="input">
        <div class="icon-wrapper">
            <div class="fas fa-folder"></div>
            <p>{{ directory.name }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "directory-thumbnail",

        props: {
            directory: {
                type: Object,
                default: ""
            }
        },

        data: () => ({
            thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJod" +
                "HRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5" +
                "vZGQiPjxwYXRoIGQ9Ik0xMSA1aDEzdjE3aC0yNHYtMjBoOGwzIDN6bS0xMC0ydjE4aDIydi0xNWgtMTIuN" +
                "DE0bC0zLTNoLTYuNTg2eiIvPjwvc3ZnPg==",
            dir: {
                name: ""
            }
        }),

        mounted()
        {
            if (this.isEditable)
            {
                this.dir = this.directory
                // this.$refs.wrapper.scrollIntoView()
                this.$refs.input.focus()
            }
        },

        computed: {
            isEditable()
            {
                return this.directory.hasOwnProperty('_editable') && this.directory._editable
            }
        },

        methods: {
            async update()
            {
                this.$emit('changed', this.dir)
            }
        }
    }
</script>
