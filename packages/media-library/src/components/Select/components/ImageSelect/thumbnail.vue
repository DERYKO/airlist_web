<template>
    <div class="thumbnail-wrapper">
        <img :src="file.url" alt="" :class="['thumbnail', {selected: selected}]">
    </div>
</template>

<script>
    export default {
        name: "image-thumbnail",

        props: {
            selected: {
                type: Boolean,
                default: false
            },
            file: {
                type: Object,
                default: () => ({})
            }
        }
    }
</script>
