import JobsLog from '../../../store/queue/index';

angular
    .module('airlst.queue')
    .factory('JobsLog', [
        '$injector',
        'JobLog',
        ($injector, JobLog) => new JobsLog(JobLog, {
            injector: $injector
        })
    ]);
