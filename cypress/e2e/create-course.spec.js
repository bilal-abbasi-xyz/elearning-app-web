describe('Create Course Page Tests', () => {

    beforeEach(() => {
        cy.setAuthToken();

        cy.fixture('mockUserData').then((userData) => {
            cy.intercept('GET', 'http://localhost:5000/api/current-user', {
                statusCode: 200,
                body: userData
            }).as('getCurrentUser');
        });

        cy.fixture('mockLectureData').then((lectures) => {
            cy.intercept('GET', 'http://localhost:5000/api/lectures', {
                statusCode: 200,
                body: lectures
            }).as('getLectures');
        });

        cy.fixture('mockQuizData').then((quizzes) => {
            cy.intercept('GET', 'http://localhost:5000/api/quizzes', {
                statusCode: 200,
                body: quizzes
            }).as('getQuizzes');
        });

        cy.visit('/create-course');
    });

    it('should display the create course page with necessary elements', () => {
        cy.wait('@getLectures');
        cy.wait('@getQuizzes');

        cy.get('#courseName').should('be.visible');

        cy.get('h3').contains('Select Lectures:');
        cy.get('h3').contains('Select Quizzes:');

        cy.get('button').contains('Create Course').should('be.visible');
    });

    it('should display an error if the course name is missing', () => {
        cy.fillCourseForm('', ['lecture1'], ['quiz1']);

        cy.get('button').contains('Create Course').click();
        cy.get('.create-course .error-message').should('contain.text', 'Failed to create course');
    });

    it('should create a course successfully and navigate to the instructor dashboard', () => {
        cy.fillCourseForm('New Angular Course', ['lecture1', 'lecture2'], ['quiz1']);

        cy.intercept('POST', 'http://localhost:5000/api/courses', {
            statusCode: 201,
            body: {
                name: 'New Angular Course',
                lectures: ['lecture1', 'lecture2'],
                quizzes: ['quiz1'],
            },
        }).as('createCourse');

        cy.get('button').contains('Create Course').click();

        cy.wait('@createCourse');

        cy.url().should('include', '/instructor-dashboard');
    });

    it('should show an error message if the course creation fails', () => {
        cy.fillCourseForm('New Angular Course', ['lecture1'], ['quiz1']);

        cy.intercept('POST', 'http://localhost:5000/api/courses', {
            statusCode: 500,
            body: { message: 'Internal Server Error' }
        }).as('createCourseFail');

        cy.get('button').contains('Create Course').click();

        cy.wait('@createCourseFail');

        cy.get('.create-course .error-message').should('contain.text', 'Failed to create course');
    });

    it('should handle missing lectures or quizzes correctly', () => {
        cy.fillCourseForm('New Course with No Lectures/Quizzes', [], []);

        cy.intercept('POST', 'http://localhost:5000/api/courses', {
            statusCode: 201,
            body: {
                name: 'New Course with No Lectures/Quizzes',
                lectures: [],
                quizzes: [],
            },
        }).as('createCourseNoLecturesQuizzes');

        cy.get('button').contains('Create Course').click();

        cy.wait('@createCourseNoLecturesQuizzes');

        cy.url().should('include', '/instructor-dashboard');
    });

    // Direct API requests:

    let courseId;
    it('should create a course through the API', () => {
        const randomName = `Test Course ${Math.random().toString(36).substr(2, 9)}`;

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/courses',
            body: {
                name: randomName,
                quizzes: ['677207c616ec03c9ff87db27', '677207cf16ec03c9ff87db33'],
                lectures: ['677208a9d8499c378bb22a53', '677208a9d8499c378bb22a52'],
                instructorId: '6771eeac7e5d8a3a7980d97b'
            },
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.course).to.have.property('name', randomName);
            courseId = response.body.course._id;
        });
    });

    it('should delete an existing course by ID', () => {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:5000/api/courses/${courseId}`,
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('message', 'Course deleted successfully');
        });
      });

});
