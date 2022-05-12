import { arrayToTree } from 'performant-array-to-tree';
import AxiosInstanceMixin from "Mixins/AxiosInstance"

export default {

    mixins: [
        AxiosInstanceMixin
    ],

    inject: [
        'getDirectoriesTree',
        'setDirectoriesTree'
    ],

    computed: {
        directoriesTree: {
            get() {
                return this.getDirectoriesTree
            },
            set(v) {
                return this.setDirectoriesTree(v)
            }
        }
    },

    methods: {
        async reloadTree()
        {
            return await this.getTree()
        },
        async getTree()
        {
            const response = await this.axios.get('media/directories/as-tree')
            let tree = arrayToTree(response.data.data, { id: 'uuid', parentId: 'parentUuid' });
            this.setDirectoriesTree( this.flatten(tree) )
        },
        flatten(nested, tree = [], level = 0)
        {
            // build string
            let str = '';
            for(let i in [...Array(level).keys()])
            {
                str = str + '- '
            }

            // flatten tree
            for (let i in nested)
            {
                let data = nested[i].data
                data.name = str + data.name
                tree.push(data)

                if (nested[i].children.length > 0)
                {
                    tree = this.flatten(nested[i].children, tree, level+1)
                }
            }

            return tree
        },
    }

}
