/**
 * @ngdoc directive
 * @name theme.airlst.directive:alDropdown
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 *
 */
angular
    .module('airlst.theme.airlst')
    .directive('alDropdown', [
        '$document',
        alDropdown
    ]);

function alDropdown($document) {
    angular.element(document).on('click', (event) => {
        const clickedElement = angular.element(event.target),
            parentSheets = clickedElement.parents('.dropdown-sheet');
        if (parentSheets.length === 0) {
            angular.element(document).find('.dropdown-sheet.open').removeClass('open');
        }
    });
    return {
        link: function (scope, element, attrs) {
            let dropdownToggle = null;

            _.forEach(angular.element(element).children(), function (v) {
                let curElem = angular.element(v);
                if (curElem.hasClass('dropdown-toggle')) {
                    dropdownToggle = curElem;
                } else if (curElem.hasClass('dropdown-sheet')) {
                    curElem.children().on('click', function (event) {
                        if (!angular.element(event.currentTarget).hasClass('keep-open')) {
                            curElem.removeClass('open');
                        }
                    })
                }
            });

            if (dropdownToggle) {
                dropdownToggle.on('click', function (e) {
                    e.preventDefault();
                    _.forEach(angular.element(element).children(), function (v) {
                        let curElem = angular.element(v);
                        if (element.attr('dropdown-disabled') > 0) {
                            return;
                        }
                        if (curElem.hasClass('dropdown-sheet')) {
                            let needsClose;
                            needsClose = curElem.hasClass('open');
                            angular.element('.dropdown-sheet').removeClass('open');
                            if (needsClose) {
                                curElem.removeClass('open');
                            } else {
                                curElem.addClass('open');
                            }
                        }
                    });
                });

                element.on('click', function (event) {
                    let isClickedElementChildOfPopup = element
                        .find(event.target)
                        .length > 0;

                    if (isClickedElementChildOfPopup && event.target.tagName.toLowerCase() !== 'a') {
                        event.stopPropagation();
                        return;
                    }

                    _.forEach(angular.element(element).children(), function (v) {
                        let curElem = angular.element(v);
                        curElem.removeClass('open');
                    });
                });
            }
        }
    };
}
