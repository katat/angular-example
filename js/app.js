'use strict';

angular.module('App', ['ui.router', 'controllers', 'ngSanitize',
    'offClick', 'smart-table', 'ng-sortable', 'ui.bootstrap', 'ngTouch'])

/*set Sanitization compile values*/
.config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|file|javascript|tel):/
    );
})

/*route provider*/
.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /login
    $urlRouterProvider.otherwise('/login');
    /* routes */
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        })
        .state('home', {
            abstract: true,
            url: '/home',
            templateUrl: 'partials/home.html'
        })
        .state('home.everyone', {
            url: '/everyone/:status?',
            templateUrl: 'partials/everyone.html',
            controller: 'everyoneProblemListCtrl'
        })
        .state('home.my', {
            url: '/my/:status?',
            templateUrl: 'partials/my.html',
            controller: 'myProblemListCtrl'
        })
        .state('home.newProblem', {
            url: '/new-problem',
            templateUrl: 'partials/newproblem.html',
            controller: 'newProblemCtrl'
        })
        .state('home.myProblemDetails', {
            url: '/problem/:problemId/my',
            templateUrl: 'partials/problem.details.html',
            controller: 'problemDetailsCtrl'
        })
        .state('home.otherProblemDetails', {
            url: '/problem/:problemId/other',
            templateUrl: 'partials/problem.details.html',
            controller: 'problemDetailsCtrl'
        })
        .state('home.problemDetails.technique', {
            url: '/:technique',
            templateUrl: 'partials/answer.technique.html',
            controller: 'answerTechniqueCtrl'
        });
})
/* config smart table pagination */
.config(function(stConfig) {
    stConfig.pagination.template = 'partials/pagination.html';
});
