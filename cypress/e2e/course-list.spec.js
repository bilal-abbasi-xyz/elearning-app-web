describe('Course List Functionality', () => {

    beforeEach(() => {

        cy.fixture('mockCourseData').then((data) => {

            cy.intercept('GET', 'http://localhost:5000/api/courses', {
                statusCode: 200,
                body: data.courseList
            }).as('getCourses');
        });

        cy.setAuthToken();

        cy.visit('/courses');
    });

    it('should display a list of courses when courses are available', () => {
        cy.wait('@getCourses');

        cy.get('.course-list-container h2').should('contain.text', 'Courses List');
        cy.get('.course-buttons .course-button').should('have.length', 2);
        cy.get('.course-buttons .course-button')
            .first()
            .should('contain.text', 'Course 1');
        cy.get('.course-buttons .course-button')
            .last()
            .should('contain.text', 'Course 2');
    });

    it('should navigate to the course details page when a course is clicked', () => {
        cy.wait('@getCourses');
        cy.get('.course-buttons .course-button').first().find('button').click();
        cy.url().should('include', '/courses/1');
    });

    it('should display "No courses available at the moment" if no courses are loaded', () => {

        cy.intercept('GET', 'http://localhost:5000/api/courses', {
            statusCode: 200,
            body: []
        }).as('getEmptyCourses');

        cy.visit('/courses');
        cy.wait('@getEmptyCourses');

        cy.get('.course-list-container p').should('contain.text', 'No courses available at the moment.');
    });

    it('should display error message when courses fail to load', () => {

        cy.intercept('GET', 'http://localhost:5000/api/courses', {
            statusCode: 500,
            body: { message: 'Failed to fetch courses' }
        }).as('getCoursesError');

        cy.visit('/courses');
        cy.wait('@getCoursesError');

        cy.get('.course-list-container .error-message').should('contain.text', 'Failed to fetch courses. Please try again later.');
    });

    it('should not display the error message when courses are fetched successfully', () => {
        cy.wait('@getCourses');
        cy.get('.course-list-container .error-message').should('not.exist');
    });

    it('should correctly display courses based on the fixture data', () => {
        cy.fixture('mockCourseData').then((data) => {
            data.testScenarios.forEach(({ courses, expectedCount }) => {

                cy.intercept('GET', 'http://localhost:5000/api/courses', {
                    statusCode: 200,
                    body: courses
                }).as('getCoursesWithData');

                cy.visit('/courses');
                cy.wait('@getCoursesWithData');

                if (expectedCount === 0) {
                    cy.get('.course-list-container p').should('contain.text', 'No courses available at the moment.');
                } else {
                    cy.get('.course-buttons .course-button').should('have.length', expectedCount);
                }
            });
        });
    });

    // Direct API requests:

    it('should fetch all courses along with their quizzes and lectures', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:5000/api/courses',
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body).to.be.an('array');

            response.body.forEach(course => {
                expect(course).to.have.property('quizzes').that.is.an('array');
                expect(course).to.have.property('lectures').that.is.an('array');
            });
        });
    });

    it('should fetch a single course by ID', () => {
        const courseId = '67732a6e4ebe493284cd92ce';
        cy.request({
            method: 'GET',
            url: `http://localhost:5000/api/courses/${courseId}`,
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const course = response.body;
            expect(course).to.have.property('quizzes').that.is.an('array');
            expect(course).to.have.property('lectures').that.is.an('array');
            expect(course).to.have.property('_id', courseId); // Check course ID matches the request
        });
    });

    it('should return a 404 error if the course ID is not found', () => {
        const invalidCourseId = 'blah blah blah';

        cy.request({
            method: 'GET',
            url: `http://localhost:5000/api/courses/${invalidCourseId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('message', 'Error fetching course');
        });
    });


});

