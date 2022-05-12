(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name templates.factory:Template
     *
     * @description
     *
     */
    angular
        .module('airlst.templates.main')
        .factory('TemplatesFastPipeRepository', TemplatesFastPipeRepository);

    function TemplatesFastPipeRepository(locale, FastPipeRepository, Ticket, TemplateType) {
        var $repo = FastPipeRepository.make('templates');

        $repo.text = {
            headline: 'Templates'
        };

        $repo.locales = ['templates', 'common'];

        $repo.columns = locale.ready($repo.locales).then(function () {
            return [
                {
                    key: 'id',
                    title: locale.getString('templates.id'),
                    type: 'integer',
                    enableClick: true
                },
                {
                    key: 'name',
                    title: locale.getString('templates.name'),
                    type: 'string',
                    enableClick: true
                },
                {
                    key: 'email',
                    title: locale.getString('templates.email'),
                    type: 'string'
                },
                {
                    key: 'subject',
                    title: locale.getString('templates.subject'),
                    type: 'string'
                },
                {
                    key: 'sender_name',
                    title: locale.getString('templates.sender_name'),
                    type: 'string'
                },
                {
                    key: 'bcc',
                    title: locale.getString('templates.bcc'),
                    type: 'string'
                },
                {
                    key: 'created_at',
                    title: locale.getString('templates.created_at'),
                    type: 'datetime'
                },
                {
                    key: 'updated_at',
                    title: locale.getString('templates.updated_at'),
                    type: 'datetime'
                }
            ];
        });

        return $repo;
    }
}());


