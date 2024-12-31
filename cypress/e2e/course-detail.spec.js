describe('Course Detail Page', () => {
    const courseId = '67732a6e4ebe493284cd92ce';

    beforeEach(() => {
        cy.fixture('mockCourseDetail').then((data) => {
            cy.intercept('GET', `http://localhost:5000/api/courses/${courseId}`, {
                statusCode: 200,
                body: data,
            }).as('getCourseDetails');
        });

        cy.setAuthToken();

        cy.visit('/courses/67732a6e4ebe493284cd92ce');
    });

    it('should display course name and details correctly', () => {
        cy.get('.course-detail-container').should('exist');
        cy.get('.course-detail-container h2').should('contain.text', 'Course 1');
    });

    it('should display lecture buttons for each lecture', () => {
        cy.get('.section-container').contains('Lectures');
        cy.get('.lecture-btn').should('have.length', 3);
        cy.get('.lecture-btn').first().should('contain.text', 'Lecture 1');
    });

    it('should display quiz buttons for each quiz', () => {
        cy.get('.section-container').contains('Quizzes');
        cy.get('.quiz-btn').should('have.length', 3);
        cy.get('.quiz-btn').first().should('contain.text', 'Quiz 1');
    });

    // Direct API requests:

    it('should fetch all quizzes', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:5000/api/quizzes',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('should fetch a single quiz by ID', () => {
        const quizId = '6772061816ec03c9ff87daf5';
        cy.request({
            method: 'GET',
            url: `http://localhost:5000/api/quizzes/${quizId}`,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('_id', quizId);
        });
    });

    it('should fetch all lectures', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:5000/api/lectures',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('should fetch a single lecture by ID', () => {
        const lectureId = '6770df44d8499c378bb22a45';
        cy.request({
            method: 'GET',
            url: `http://localhost:5000/api/lectures/${lectureId}`,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('_id', lectureId);
        });
    });

});
