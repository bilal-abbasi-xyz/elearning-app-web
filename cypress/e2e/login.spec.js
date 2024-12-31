describe('Login Functionality', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login form with username and password fields', () => {
        cy.get('input[formControlName="username"]').should('be.visible');
        cy.get('input[formControlName="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should enable login button when both fields are filled', () => {
        cy.get('input[formControlName="username"]').type('validUser');
        cy.get('input[formControlName="password"]').type('validPassword');
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should allow login with valid credentials', function () {
        cy.fixture('loginData.json').then((data) => {
            data.valid.forEach((user) => {
                cy.login(user.username, user.password);
                cy.url().should('include', '/dashboard');
                cy.visit('/login');
            });
        });
    });

    it('should show error for invalid credentials', function () {
        cy.fixture('loginData.json').then((data) => {
            data.invalid.forEach((user) => {
                cy.login(user.username, user.password);
                cy.get('.error-message').should('be.visible').and('contain', 'Invalid credentials, please try again.');
            });
        });
    });

    it('should allow login for instructor', function () {
        cy.fixture('loginData.json').then((data) => {
            const instructorUser = data.validInstructor.find(user => user.username === 'instructor1');
            if (instructorUser) {
                cy.login(instructorUser.username, instructorUser.password);
                cy.url().should('include', '/instructor-dashboard');
            } else {
                assert.fail('Instructor user not found in fixture data.');
            }
        });
    });


    /* ==== Test Created with Cypress Studio ==== */
    it('cypress-studio.spec.js', function() {
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:4200/login');
        cy.get('button').should('be.disabled');
        cy.get('#password').click();
        cy.get('#username').clear('s');
        cy.get('#username').type('student1');
        cy.get('#password').clear('p');
        cy.get('#password').type('password123');
        cy.get('button').should('be.enabled');
        /* ==== End Cypress Studio ==== */
    });
});
