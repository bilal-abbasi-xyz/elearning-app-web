const { getCurrentUser } = require("../../server/controllers/authController");

describe('Dashboard Functionality', () => {

    beforeEach(() => {

        cy.fixture('mockUserData').then((mockUserData) => {
            cy.intercept('GET', 'http://localhost:5000/api/current-user', {
                statusCode: 200,
                body: mockUserData
            }).as('getUserData');
        });

        cy.setAuthToken();

        cy.visit('/dashboard');
    });

    it('should display the correct username and email for the logged-in user', () => {
        cy.wait('@getUserData');
        cy.get('.dashboard-container h1').should('contain.text', 'Welcome, validUser!');
        cy.get('.dashboard-container p').should('contain.text', 'Email: validuser@example.com');
    });


    it('should navigate to the courses list when the "Courses List" button is clicked', () => {
        cy.wait('@getUserData');
        cy.get('button').contains('Courses List').click();
        cy.url().should('include', '/courses');
    });

    it('should not display the error message when user data loads correctly', () => {
        cy.get('.error-message').should('not.exist');
    });

    // Direct API requests:

    // it('should fetch the current user details', () => {

    //     cy.request({
    //         method: 'GET',
    //         url: 'http://localhost:5000/api/current-user',
    //         headers: {
    //             Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    //         },
    //     }).then((response) => {
    //         expect(response.status).to.eq(200);
    //         expect(response.body).to.have.property('username');
    //         expect(response.body).to.have.property('email');
    //         expect(response.body).to.have.property('role');
    //         expect(response.body).to.have.property('grades').that.is.an('array');
    //     });
    // });


});


