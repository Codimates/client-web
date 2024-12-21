/* eslint-disable no-undef */
describe('Register Page', () => {
    beforeEach(() => {
      // Visit the Register page before each test
      cy.visit('http://localhost:3000/register'); 
    });
  
    it('should display the registration form correctly', () => {
      // Verify that all input fields and the register button are visible
      cy.get('#fname').should('be.visible');
      cy.get('#lname').should('be.visible');
      cy.get('#email').should('be.visible');
      cy.get('#phone_number').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('#confirmPassword').should('be.visible');
      cy.get('#address').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Register');
    });
  
    it('should show validation errors for empty required fields', () => {
      // Attempt to submit the form without filling any fields
      cy.get('button[type="submit"]').click();
  
      // Verify validation errors (assuming error messages are displayed)
      cy.contains('An error occurred. Please try again later.').should('be.visible');
      cy.contains('An error occurred. Please try again later.').should('be.visible');
      cy.contains('An error occurred. Please try again later.').should('be.visible');
      cy.contains('An error occurred. Please try again later.').should('be.visible');
      cy.contains('An error occurred. Please try again later.').should('be.visible');
      cy.contains('An error occurred. Please try again later.').should('be.visible');
      cy.contains('An error occurred. Please try again later.').should('be.visible');
    });
  
    it('should show an error if passwords do not match', () => {
      // Fill in all fields with mismatched passwords
      cy.get('#fname').type('John');
      cy.get('#lname').type('Doe');
      cy.get('#email').type('john.doe@example.com');
      cy.get('#phone_number').type('1234567890');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password456');
      cy.get('#address').type('123 Test Street');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify the error message
      cy.contains('Passwords do not match!').should('be.visible');
    });
  
    it('should successfully submit the form with valid data', () => {
      // Mock the API request
      cy.intercept('POST', '/user/createuser', {
        statusCode: 201,
        body: { message: 'Registration successful!' },
      }).as('registerUser');
  
      // Fill in all fields with valid data
      cy.get('#fname').type('John');
      cy.get('#lname').type('Doe');
      cy.get('#email').type('john.doe1@example.com');
      cy.get('#phone_number').type('1234567890');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('#address').type('123 Test Street');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the mock API to be called
      cy.wait('@registerUser');
  
      // Verify success message and redirection
      cy.contains('Registration successful!').should('be.visible');
      cy.url().should('include', '/signin'); // Replace '/signin' with the actual redirect path
    });
  });
  