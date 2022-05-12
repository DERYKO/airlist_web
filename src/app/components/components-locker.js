
  angular
    .module('airlst.components').config(lockerConfig);

  function lockerConfig(lockerProvider) {
    lockerProvider.defaults({
      driver: 'local',
      namespace: false,
      separator: '.',
      eventsEnabled: true,
      extend: {}
    });
  }
