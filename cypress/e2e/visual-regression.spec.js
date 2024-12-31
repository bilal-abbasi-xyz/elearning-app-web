describe('Visual Regression Testing', () => {
    it('should match the login page UI', () => {
        cy.visit('http://localhost:4200/login'); // Visit the login page
        cy.get('[data-cy="login-form"]').should('be.visible'); // Ensure element visibility
        cy.matchImageSnapshot('login-page'); // Take and compare a snapshot
    });
});
