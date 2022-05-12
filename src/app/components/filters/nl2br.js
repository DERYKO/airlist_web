angular
    .module('airlst.components')
    .filter('nl2br', [
        '$sce',
        nl2brFilter
    ]);

function nl2brFilter($sce) {
    return function (msg, is_xhtml) {
        is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        return $sce.trustAsHtml(msg);
    };
}