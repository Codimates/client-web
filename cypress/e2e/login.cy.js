/* eslint-disable no-undef */
describe('Sign In Page Tests', () => {
  beforeEach(() => {
    // Mock API requests
    cy.intercept('POST', '/user/logincustomer', {
      statusCode: 200,
      body: { role: 'customer', token: 'mock-token' },
    }).as('loginRequest');

    cy.intercept('GET', '/user/profile', {
      statusCode: 200,
      body: { name: 'Test User' },
    }).as('profileRequest');

    // Visit sign-in page
    cy.visit('http://localhost:3000/signin');
  });

  it('should display the sign-in page with all elements', () => {
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
  });

  it('should show error messages for empty fields', () => {
    // Attempt login without entering credentials
    cy.contains('button', 'Login').click();

    // Assert error indicators on fields
    cy.get('input#email:invalid').should('exist');
    cy.get('input#password:invalid').should('exist');
  });

  it('should show error for incorrect email format', () => {
    // Enter invalid email format and a password
    cy.get('input#email').type('invalid-email');
    cy.get('input#password').type('password123');

    // Attempt login
    cy.contains('button', 'Login').click();

    // Assert error indicator on email field
    cy.get('input#email:invalid').should('exist');
  });

  it('should successfully log in with valid credentials', () => {
    // Enter valid credentials
    cy.get('input#email').type('dilshantharindu8@gmail.com');
    cy.get('input#password').type('12345');

    // Attempt login
    cy.contains('button', 'Login').click();

    // Wait for the mocked login request to complete
    cy.wait('@loginRequest');

    // Assert redirection to home page
    cy.url().should('include', '/home');
  });
});
