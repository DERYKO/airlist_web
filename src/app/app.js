// import '../style/app.css';

import qrcode from 'qrcode-generator';

window.qrcode = qrcode;

import '../style/main.scss';

import 'babel-polyfill';

import jQuery from 'jquery';

window.jQuery = jQuery;
import 'jquery-ui/ui/widgets/sortable';
import Selectize from 'selectize';

window.Selectize = Selectize;
import moment from 'moment';

window.moment = moment;
import PDFJS from 'pdfjs-dist';

window.PDFJS = PDFJS;
import _ from 'lodash';

window._ = _;
import 'quill';

// Import Ace Editor
require('ace-builds/src-min-noconflict/ace');
require('ace-builds/src-min-noconflict/ext-language_tools');
require('ace-builds/src-min-noconflict/theme-chrome');
require('ace-builds/src-min-noconflict/mode-html');
require('ace-builds/src-min-noconflict/mode-twig');
require('ace-builds/src-min-noconflict/snippets/html');
require('ace-builds/src-min-noconflict/snippets/twig');

require('qrcode-generator/qrcode_UTF8');

jQuery.fn.textWidth = function (text, font) {
    if (!jQuery.fn.textWidth.fakeEl) jQuery.fn.textWidth.fakeEl = jQuery('<span>').hide().appendTo(document.body);
    jQuery.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return jQuery.fn.textWidth.fakeEl.width();
};

// import tempates
//@require "./**/*.html"

const MODULE_NAME = 'airlst';
export default MODULE_NAME;

require('./app-module.js');
