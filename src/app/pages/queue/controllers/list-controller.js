export default class QueueListController {
    constructor(JobsLog) {
        this.store = JobsLog;
    }
}

QueueListController.$inject = [
    'JobsLog'
];
