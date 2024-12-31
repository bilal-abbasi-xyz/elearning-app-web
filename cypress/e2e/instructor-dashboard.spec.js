describe('Instructor Dashboard Functionality', () => {

    beforeEach(() => {

        cy.fixture('mockUserData').then((mockUserData) => {
            cy.intercept('GET', 'http://localhost:5000/api/current-user', {
                statusCode: 200,
                body: mockUserData
            }).as('getCurrentUser');
        });

        cy.fixture('mockCourseData').then((data) => {
            cy.intercept('GET', 'http://localhost:5000/api/courses', {
                statusCode: 200,
                body: data.courseList
            }).as('getCourses');
        });

        cy.setAuthToken();

        cy.visit('/instructor-dashboard');
    });

    it('should display the instructor name and the courses list', () => {
        cy.wait('@getCurrentUser');
        cy.wait('@getCourses');

        cy.get('.instructor-dashboard p').should('contain.text', 'Welcome, validUser!');

        cy.get('.course-item').should('have.length', 2);
    });

    it('should show an error message if there is an issue fetching user details', () => {
        cy.intercept('GET', 'http://localhost:5000/api/current-user', {
            statusCode: 500,
            body: { message: 'Internal server error' }
        }).as('getUserError');

        cy.visit('/instructor-dashboard');
        cy.wait('@getUserError');

        cy.get('.instructor-dashboard .error-message').should('contain.text', 'Error fetching user details. Please log in again.');
    });


    it('should display "No courses found" message when no courses are available', () => {
        cy.intercept('GET', 'http://localhost:5000/api/courses', {
            statusCode: 200,
            body: []
        }).as('getEmptyCourses');

        cy.visit('/instructor-dashboard');
        cy.wait('@getEmptyCourses');

        cy.get('.instructor-dashboard p').should('contain.text', 'No courses found. Create your first course!');
    });

    it('should navigate to create course page when "Create New Course" button is clicked', () => {
        cy.wait('@getCurrentUser');
        cy.wait('@getCourses');

        cy.get('.create-course-btn').click();
        cy.url().should('include', '/create-course');
    });

    it('should navigate to edit course page when "Edit" button is clicked', () => {
        cy.wait('@getCurrentUser');
        cy.wait('@getCourses');

        cy.get('.course-item').first().find('.edit-btn').click();
        cy.url().should('include', '/edit-course/1');
    });

    it('should delete a course when the "Delete" button is clicked', () => {
        cy.wait('@getCurrentUser');
        cy.wait('@getCourses');

        cy.intercept('DELETE', 'http://localhost:5000/api/courses/1', {
            statusCode: 200,
            body: {}
        }).as('deleteCourse');

        cy.get('.course-item').first().find('.delete-btn').click();
        cy.wait('@deleteCourse');

        cy.get('.course-item').should('have.length', 1);
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

