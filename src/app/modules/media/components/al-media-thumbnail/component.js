import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name airlst.modules.media.component:al-media-thumbnail
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.modules.media">
 <file name="index.html">
 <al-media-thumbnail file="{}"></al-media-thumbnail>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alMediaThumbnail', {
        bindings: {
            file: '<'
        },
        controller: 'MediaAlMediaThumbnailComponentCtrl',
        controllerAs: 'vm',
        templateUrl: template
    });
