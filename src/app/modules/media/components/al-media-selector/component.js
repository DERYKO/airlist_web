import template from './views/component.tpl.html';
import './controllers/component-controller';
import './controllers/modal-controller';
import AlMediaSelectorComponentController from "./controllers/component-controller";
import Vue from 'vue'
import MediaLibrary from '@airlst/media-library'
import '@airlst/media-library/dist/media-library.css'
import env from '../../../../../../env';

/**
 * @ngdoc component
 * @name components.component:al-switch
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <al-media-selector></al-media-selector>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .directive('mediaLibraryWrapper',['$auth',  function($auth) {
        return {
            scope: {
                selectedFn: '&',
                selectedFile: '=',
                startDirectoryUuid: '<',
                allowedMimes: '<'
            },
            link: function(scope, $element) {
                if ( ! scope.vue)
                {
                    scope.vue = new Vue({
                        el: 'media-library',
                        components:{ MediaLibrary },

                        computed: {
                            authToken()
                            {
                                return $auth.getToken()
                            },
                            apiBaseUrl()
                            {
                                return env.apiUrl;
                            },
                            startDirectory()
                            {
                                return scope.startDirectoryUuid || null;
                            },
                            allowedMimes()
                            {
                                return scope.allowedMimes || [];
                            }
                        },
                        methods: {
                            selected(file)
                            {
                                scope.selectedFn({file})
                            }
                        }
                    })
                }
            }
        }
    }])
    .component('alMediaSelector', {
        bindings: {
            //selectedFile: '='
            currentSelectedFile: '<',
            onFileSelect: '&',
            startDirectory: '<',
            allowedMimes: '<'
        },
        controller: AlMediaSelectorComponentController,
        controllerAs: 'vm',
        templateUrl: template
    });
