'use strict';
angular.module('controllers', ['Services'])
    //root Controller
    .controller('appCtrl', function($rootScope, $scope, $state, $location) {
        //determine active class for nav bar
        $scope.getNavClass = function(states) {
            for (var i = 0; i < states.length; i++) {
                if ($state.current.name.indexOf(states[i]) !== -1) {
                    return 'active';
                }
            }
        };

        //determine actiev class for status filter nav bar
        $scope.getStatusClass = function(status) {
            if (status === $state.params.status) {
                return 'active';
            }
            if (!status && !$state.params.status) {
                return 'active';
            }
        };

        //go to create new problem view
        $scope.gotoNewProblem = function() {
            $location.path('/home/new-problem');
        };

        //determine everyone or my problem listings view to go
        $scope.filterProblems = function(status) {
            var path;
            status = status || '';
            if ($state.current.name.indexOf('home.my') !== -1) {
                path = '/home/my/' + status;
            } else {
                path = '/home/everyone/' + status;
            }
            $location.path(path);
        };

        //check if it is login view
        $scope.isLoginView = function() {
            if ($state.current.name === 'login') {
                return true;
            }
            return false;
        };

        //seach data
        $scope.searchData = function(searchInput) {
            $rootScope.$broadcast('searchData', {search: searchInput});
        };

        //search param
        $scope.search = {};

        //clear search input
        $rootScope.$on('$stateChangeStart', function() {
            delete $scope.search.searchInput;
        });
    })
    //login controller
    .controller('loginCtrl', function($scope, $state) {
        //remember check model
        $scope.remember = true;

        //do login
        $scope.login = function() {
            $scope.usernameError = false;
            $scope.pwdError = false;
            $scope.hassError = false;
            if ($scope.username === 'user1' && $scope.password === '123') {
                $state.go('home.my');
            }else {
                $scope.hasError = true;
            }
            if ($scope.username !== 'user1') {
                $scope.usernameError = true;
            }
            if ($scope.password !== '123') {
                $scope.pwdError = true;
            }
        };
    })
    //create problem controller
    .controller('newProblemCtrl', function($scope, $state, $window, Problems) {
        //mock add new problem
        $scope.addNewProblem = function() {
            Problems.getData(function(data) {
                var id = data.length;
                data.unshift({
                    id: id,
                    username: 'user1',
                    thumbnail: './i/src/person.png',
                    name: $scope.problemName,
                    description: $scope.description,
                    createDate: new Date(),
                    status: 'open',
                    technique: null,
                    public: true,
                    answers: []
                });
                $state.go('home.myProblemDetails', {problemId: id});
            });
        };
        //cancel adding new problem
        $scope.cancel = function() {
            $window.history.back();
        };
    })
    //everyone problem listing controller
    .controller('everyoneProblemListCtrl',
        function($scope, $state, Problems) {
            //page size
            $scope.itemsByPage = 8;
            //page size options
            $scope.pageSizes = [8, 15, 20];
            //listen data search operation
            $scope.$on('searchData', function(event, params) {
                $scope.searchData(params.search);
            });
            //search data
            $scope.searchData = function(keyword) {
                if (!keyword || keyword === '') {
                    Problems.getData(function(data) {
                        $scope.updateData(data);
                    });
                    return;
                }
                if (!$scope.problemList) {
                    return;
                }
                var results = $scope.problemList.filter(function(problem) {
                    if ($scope.compareColumn(problem, 'username', keyword)) {
                        return true;
                    }
                    if ($scope.compareColumn(problem, 'name', keyword)) {
                        return true;
                    }
                    if ($scope.compareColumn(problem, 'description', keyword)) {
                        return true;
                    }
                    return false;
                });
                $scope.updateData(results);
            };
            //refresh data
            $scope.updateData = function(data) {
                $scope.problemList = data;
                $scope.displayedProblemList = [].concat($scope.problemList);
            };
            Problems.getData(function(data) {
                $scope.updateData(data);
            });
            //compare column data
            $scope.compareColumn = function(obj, column, val) {
                var index = obj[column].toLowerCase().indexOf(val.toLowerCase());
                if (index !== -1) {
                    return true;
                }
                return false;
            };
            //change page size
            $scope.changePageSize = function(size) {
                $scope.itemsByPage = size;
            };
            //toggle create modal
            $scope.toggleCreateModal = function() {
                $scope.tmpSaveProblem = {};
                $scope.showCreateModal = !$scope.showCreateModal;
            };
            //go to problem details view
            $scope.gotoProblemDetails = function(id) {
                for (var i = 0; i < $scope.problemList.length; i++) {
                    if ($scope.problemList[i].id === id &&
                        $scope.problemList[i].username === 'user1') {
                        return $state.go('home.myProblemDetails', {
                            problemId: id
                        });
                    } else {
                        return $state.go('home.otherProblemDetails', {
                            problemId: id
                        });
                    }
                }
            };
            //mock save problem
            $scope.edit = function() {
                Problems.getData(function(data) {
                    var id = data.length;
                    data.unshift({
                        id: id,
                        username: 'user1',
                        thumbnail: './i/src/person.png',
                        name: $scope.tmpSaveProblem.name,
                        description: $scope.tmpSaveProblem.description,
                        createDate: new Date(),
                        status: 'open',
                        technique: null,
                        public: true,
                        answers: []
                    });
                    $state.go('home.myProblemDetails', {problemId: id});
                });
            };
        }
    )
    //my problem listing view
    .controller('myProblemListCtrl',
        function($scope, $state, Problems) {
            //page size options
            $scope.pageSizes = [8, 15, 20];
            //page size
            $scope.itemsByPage = 8;
            //listen for search operation
            $scope.$on('searchData', function(event, params) {
                $scope.searchData(params.search);
            });
            //search data
            $scope.searchData = function(keyword) {
                if (!keyword || keyword === '') {
                    Problems.getData(function(data) {
                        $scope.updateData(data);
                    });
                    return;
                }
                if (!$scope.problemList) {
                    return;
                }
                var results = $scope.problemList.filter(function(problem) {
                    if ($scope.compareColumn(problem, 'name', keyword)) {
                        return true;
                    }
                    if ($scope.compareColumn(problem, 'description', keyword)) {
                        return true;
                    }
                    return false;
                });
                $scope.updateData(results);
            };
            //refresh data
            $scope.updateData = function(data) {
                $scope.problemList = data;
                $scope.displayedProblemList = [].concat(
                    $scope.problemList.filter(function(problem) {
                        return problem.username === 'user1';
                    })
                );
            };
            Problems.getData(function(data) {
                $scope.updateData(data);
            });
            //compare column data
            $scope.compareColumn = function(obj, column, val) {
                if (obj[column].toLowerCase().indexOf(val.toLowerCase()) !== -1) {
                    return true;
                }
                return false;
            };
            //change page size
            $scope.changePageSize = function(size) {
                $scope.itemsByPage = size;
            };
            //goto problem details view
            $scope.gotoProblemDetails = function(id) {
                $state.go('home.myProblemDetails', {problemId: id});
            };
            //toggle delete modal
            $scope.toggleDeleteModal = function(problem) {
                $scope.showDeleteModal = !$scope.showDeleteModal;
                if (problem) {
                    $scope.tmpProblem = problem;
                }
            };
            //toggle close modal
            $scope.toggleCloseModal = function(problem) {
                $scope.showCloseModal = !$scope.showCloseModal;
                if (problem) {
                    $scope.tmpProblem = problem;
                }
            };
            //toggle create modal
            $scope.toggleCreateModal = function() {
                $scope.tmpSaveProblem = {};
                $scope.showCreateModal = !$scope.showCreateModal;
            };
            //save problem
            $scope.edit = function() {
                Problems.getData(function(data) {
                    var id = data.length;
                    data.unshift({
                        id: id,
                        username: 'user1',
                        thumbnail: './i/src/person.png',
                        name: $scope.tmpSaveProblem.name,
                        description: $scope.tmpSaveProblem.description,
                        createDate: new Date(),
                        status: 'open',
                        technique: null,
                        public: true,
                        answers: []
                    });
                    $state.go('home.myProblemDetails', {problemId: id});
                });
            };
            //delete problem
            $scope.delete = function() {
                var index = $scope.problemList.indexOf($scope.tmpProblem);
                $scope.problemList.splice(index, 1);
                $scope.toggleDeleteModal();
            };
            //close problem
            $scope.close = function() {
                $scope.tmpProblem.status = 'closed';
                $scope.toggleCloseModal();
            };
            //check if the listing has the user' problem
            $scope.hasUserProblem = function() {
                if (!$scope.problemList) {
                    return false;
                }
                for (var i = 0; i < $scope.problemList.length; i++) {
                    if ($scope.problemList[i].username === 'user1') {
                        return true;
                    }
                }
            };
            //determine if it is the problem author
            $scope.isUserProblem = function(problem) {
                if (problem.username === 'user1') {
                    return true;
                }
                return false;
            };
            //toggle public
            $scope.togglePublic = function(problem) {
                if (problem.status === 'private') {
                    problem.status = 'open';
                }else {
                    problem.status = 'private';
                }
            };
            //toggle options
            $scope.toggleOptions = function() {
                this.showOptions = !this.showOptions;
            };
            //check if there are closed problems in the listing
            $scope.hasClosedProblems = function() {
                if (!$scope.problemList) {
                    return false;
                }
                var has = $scope.problemList.filter(function(problem) {
                    if (problem.status === 'closed') {
                        return true;
                    }
                });
                if (has && has.length > 0) {
                    return true;
                }
                return false;
            };
        }
    )
    //problem details controller
    .controller('problemDetailsCtrl', function($scope, $state, $window, Problems) {
        //technique modes
        $scope.techniques = [
            'teleportation',
            'brainstorming',
            'superpowers',
            'exaggeration',
            'regular'
        ];
        //switch technique mode
        $scope.gotoTechnique = function() {
            $scope.problemDetails.technique = $scope.techniques[$scope.slideIndex];
        };
        //determine technique mode
        $scope.getTechnique = function(problem) {
            var index = $scope.techniques.indexOf(problem.technique);
            if (index !== -1) {
                $scope.slideIndex = index;
            }else {
                $scope.slideIndex = 4;
            }
        };
        //go to previous technique mode
        $scope.prevSlide = function() {
            if (--$scope.slideIndex < 0) {
                $scope.slideIndex = 4;
            }
            $scope.gotoTechnique();
        };
        //go to next technique mode
        $scope.nextSlide = function() {
            if (++$scope.slideIndex > 4) {
                $scope.slideIndex = 0;
            }
            $scope.gotoTechnique();
        };
        Problems.getData(function(data) {
            $scope.problemList = data;
        });
        //load problem details
        $scope.getProblemDetails = function() {
            if (!$scope.problemList) {
                return;
            }
            for (var i = 0; i < $scope.problemList.length; i ++) {
                var problemDetails = $scope.problemList[i];
                if (parseInt($state.params.problemId) === problemDetails.id) {
                    $scope.problemDetails = problemDetails;
                    $scope.getTechnique($scope.problemDetails);
                    return $scope.problemDetails;
                }
            }
        };
        //demote an answer
        $scope.demote = function(answer) {
            answer.demote = !answer.demote;
            $scope.sortAnswers();
        };
        //toggle problem into technique mode
        $scope.showTechniques = function() {
            $scope.problemDetails.technique = 'teleportation';
            $scope.getTechnique($scope.problemDetails);
        };
        //check if the answer is in the current technique mode
        $scope.showInTechnique = function(answer) {
            return answer.technique === $scope.techniques[$scope.slideIndex];
        };
        //add answer
        $scope.addAnswer = function(answerInput) {
            if (!answerInput && !$scope.answerInput) {
                return;
            }
            var answer = {
                'username': 'user1',
                'thumbnail': '../i/src/person.png',
                'date': new Date(),
                'description': answerInput || $scope.answerInput,
                'technique': $scope.problemDetails.technique
            };
            $scope.answerInput = null;
            $scope.getProblemDetails().answers.unshift(answer);
        };
        //show the answers in the current mode
        $scope.filterAnswers = function(answer) {
            if ($scope.problemDetails.technique === 'regular' || !$scope.problemDetails.technique) {
                if (answer.technique && answer.included) {
                    return true;
                }
                if (!answer.technique || answer.technique === 'regular') {
                    return true;
                }
            }else {
                if (answer.technique === $scope.problemDetails.technique) {
                    return true;
                }
            }
        };
        //toggle edit modal
        $scope.toggleEditModal = function() {
            $scope.tmpSaveProblem = {
                name: $scope.problemDetails.name,
                description: $scope.problemDetails.description
            };
            $scope.showEditModal = !$scope.showEditModal;
        };
        //toggle close modal
        $scope.toggleCloseModal = function() {
            $scope.showCloseModal = !$scope.showCloseModal;
        };
        //toggle delete modal
        $scope.toggleDeleteModal = function() {
            $scope.showDeleteModal = !$scope.showDeleteModal;
        };
        //toggle delete answer modal
        $scope.toggleDeleteAnswerModal = function($index) {
            $scope.deleteAnswerIndex = $index;
            $scope.showDeleteAnswerModal = !$scope.showDeleteAnswerModal;
        };
        //toggle create answer modal
        $scope.toggleCreateAnswerModal = function() {
            $scope.tmpAnswer = {};
            $scope.showCreateAnswerModal = !$scope.showCreateAnswerModal;
        };
        //delete problem
        $scope.delete = function() {
            var index = $scope.problemList.indexOf($scope.problemDetails);
            $scope.problemList.splice(index, 1);
            $scope.toggleDeleteModal();
        };
        //delete answer
        $scope.deleteAnswer = function() {
            $scope.problemDetails.answers.splice($scope.deleteAnswerIndex, 1);
            $scope.toggleDeleteAnswerModal();
        };
        //edit problem
        $scope.edit = function() {
            $scope.problemDetails.name = $scope.tmpSaveProblem.name;
            $scope.problemDetails.description = $scope.tmpSaveProblem.description;
            $scope.toggleEditModal();
        };
        //close problem
        $scope.close = function() {
            $scope.problemDetails.status = 'closed';
            $scope.toggleCloseModal();
        };
        //include answer in technique mode
        $scope.include = function(answer) {
            answer.included = !answer.included;
        };
        //navigate back
        $scope.goback = function() {
            if ($state.current.name === 'home.otherProblemDetails') {
                $state.go('home.everyone');
            }else {
                $state.go('home.my');
            }
        };
        //toggle status
        $scope.togglePublic = function() {
            if ($scope.problemDetails.status === 'open') {
                $scope.problemDetails.status = 'private';
            }else {
                $scope.problemDetails.status = 'open';
            }
        };
        //check if it is problem auhor
        $scope.isUserProblem = function() {
            if (!$scope.problemDetails) {
                return;
            }
            return $scope.problemDetails.username === 'user1';
        };
        //toggle options
        $scope.toggleOptions = function() {
            this.showOptions = !this.showOptions;
        };
        $scope.getIncludeClass = function(answer) {
            if (answer.included) {
                return 'include-btn-checked';
            }else {
                return 'include-btn-nochecked';
            }
        };
        $scope.sortAnswers = function() {
            $scope.problemDetails.answers.sort(function(x, y) {
                return (x.demote === y.demote) ? 0 : x.demote ? 1 : -1;
            });
        };
    });
