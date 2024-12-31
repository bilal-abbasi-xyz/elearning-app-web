describe('Sign Up Functionality', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });

    it('should display signup form with username, email, and password fields', () => {
        cy.get('input[formControlName="username"]').should('be.visible');
        cy.get('input[formControlName="email"]').should('be.visible');
        cy.get('input[formControlName="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should enable the sign-up button when all fields are filled correctly', () => {
        cy.get('input[formControlName="username"]').type('validUser');
        cy.get('input[formControlName="email"]').type('valid@example.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('button should be disabled if fields empty', () => {
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('button should be disabled for invalid email format', () => {
        cy.get('input[formControlName="username"]').type('validUser');
        cy.get('input[formControlName="email"]').type('invalidEmail');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').should('be.disabled');
    });
});

