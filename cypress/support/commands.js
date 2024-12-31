// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.get('[formControlName="username"]').type(username);
    cy.get('[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('visitApp', () => {
    cy.visit('http://localhost:4200');
});

Cypress.Commands.add('signup', (username, email, password) => {
    cy.get('[formControlName="username"]').type(username);
    cy.get('[formControlName="email"]').type(email);
    cy.get('[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('setAuthToken', () => {
    const token = "mocked-jwt-token";
    cy.window().then((window) => {
        window.localStorage.clear();
        window.localStorage.setItem('token', token);
    });
});

Cypress.Commands.add('fillCourseForm', (courseName, selectedLectures, selectedQuizzes) => {
    if (courseName) {
        cy.get('#courseName').type(courseName);
    } else {
        cy.get('#courseName').clear();
    }
    selectedLectures.forEach((lectureId) => {
        cy.get(`input[type="checkbox"][value="${lectureId}"]`).check();
    });

    selectedQuizzes.forEach((quizId) => {
        cy.get(`input[type="checkbox"][value="${quizId}"]`).check();
    });
});