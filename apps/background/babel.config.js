// const rxjs = {
//   Observable: 'internal/Observable',
//   ConnectableObservable: 'internal/observable/ConnectableObservable',
//   GroupedObservable: 'internal/operators/groupBy',
//   observable: 'internal/symbol/observable',
//   Subject: 'internal/Subject',
//   BehaviorSubject: 'internal/BehaviorSubject',
//   ReplaySubject: 'internal/ReplaySubject',
//   AsyncSubject: 'internal/AsyncSubject',
//   asapScheduler: 'internal/scheduler/asap',
//   asyncScheduler: 'internal/scheduler/async',
//   queueScheduler: 'internal/scheduler/queue',
//   animationFrameScheduler: 'internal/scheduler/animationFrame',
//   VirtualTimeScheduler: 'internal/scheduler/VirtualTimeScheduler',
//   Scheduler: 'internal/Scheduler',
//   Subscription: 'internal/Subscription',
//   Subscriber: 'internal/Subscriber',
//   Notification: 'internal/Notification',
//   pipe: 'internal/util/pipe',
//   noop: 'internal/util/noop',
//   identity: 'internal/util/identity',
//   isObservable: 'internal/util/isObservable',
//   ArgumentOutOfRangeError: 'internal/util/ArgumentOutOfRangeError',
//   EmptyError: 'internal/util/EmptyError',
//   ObjectUnsubscribedError: 'internal/util/ObjectUnsubscribedError',
//   UnsubscriptionError: 'internal/util/UnsubscriptionError',
//   TimeoutError: 'internal/util/TimeoutError',
//   bindCallback: 'internal/observable/bindCallback',
//   bindNodeCallback: 'internal/observable/bindNodeCallback',
//   combineLatest: 'internal/observable/combineLatest',
//   concat: 'internal/observable/concat',
//   defer: 'internal/observable/defer',
//   empty: 'internal/observable/empty',
//   forkJoin: 'internal/observable/forkJoin',
//   from: 'internal/observable/from',
//   fromEvent: 'internal/observable/fromEvent',
//   fromEventPattern: 'internal/observable/fromEventPattern',
//   generate: 'internal/observable/generate',
//   iif: 'internal/observable/iif',
//   interval: 'internal/observable/interval',
//   merge: 'internal/observable/merge',
//   never: 'internal/observable/never',
//   of: 'internal/observable/of',
//   onErrorResumeNext: 'internal/observable/onErrorResumeNext',
//   pairs: 'internal/observable/pairs',
//   race: 'internal/observable/race',
//   range: 'internal/observable/range',
//   throwError: 'internal/observable/throwError',
//   timer: 'internal/observable/timer',
//   using: 'internal/observable/using',
//   zip: 'internal/observable/zip',
//   EMPTY: 'internal/observable/empty',
//   NEVER: 'internal/observable/never',
//   config: 'internal/config',
// };

// const rxjsAjax = {
//   ajax: 'internal/observable/dom/ajax',
//   AjaxRequest: 'internal/observable/dom/AjaxObservable',
//   AjaxResponse: 'internal/observable/dom/AjaxObservable',
//   AjaxError: 'internal/observable/dom/AjaxObservable',
//   AjaxTimeoutError: 'internal/observable/dom/AjaxObservable',
// };

// const transformImports = [
//   [
//     'transform-imports',
//     {
//       rxjs: {
//         transform: (importName, matches) => `rxjs/${rxjs[importName]}`,
//         preventFullImport: true,
//         skipDefaultConversion: true,
//       },
//       'rxjs/ajax': {
//         transform: (importName, matches) => `rxjs/${rxjsAjax[importName]}`,
//         preventFullImport: true,
//         skipDefaultConversion: true,
//       },
//       'rxjs/operators': {
//         transform: 'rxjs/internal/operators/${member}',
//         preventFullImport: true,
//         skipDefaultConversion: true,
//       },
//     },
//   ],
// ];

// module.exports = {
//   plugins: [
//     ...transformImports,
//     [
//       'ramda',
//       {
//         useES: true,
//       },
//     ],
//   ],
//   presets: [
//     ['@babel/preset-env', { modules: false, targets: { esmodules: true } }],
//   ],
// };
