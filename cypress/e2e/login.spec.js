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

    it('should show error message with invalid credentials', () => {
        cy.get('input[formControlName="username"]').type('invalidUser');
        cy.get('input[formControlName="password"]').type('invalidPassword');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible').and('contain', 'Invalid credentials, please try again.');
    });

    it('should allow login with valid credentials', function () {
        cy.fixture('loginData.json').then((data) => {
            data.valid.forEach((user) => {
                cy.login(user.username, user.password); 
                cy.url().should('include', '/dashboard');
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

});
