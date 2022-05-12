import fileSizeFormatter from './filters/file-size-formatter';

angular.module('airlst.modules.media', [
    'airlst.components'
]).filter('mediaFormatFileSize', fileSizeFormatter);

require('./routes');

require('./components/al-media-thumbnail/component');
require('./components/al-media-selector/component.js');
