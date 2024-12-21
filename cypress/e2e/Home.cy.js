/* eslint-disable no-undef */
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/home');
  });

  it('should load the home page correctly', () => {
    // Check if the page title is correct
    cy.title().should('include', 'React App');
  });

  it('should display the About Us section', () => {
    // Verify if the About Us header is present and visible
    cy.get('h2')
      .contains('About Us')
      .should('be.visible');
    
    // Check if the about text is visible
    cy.get('p')
      .contains('At LapLanka.lk, we specialize in providing top-notch delivery services across Sri Lanka.')
      .should('be.visible');
  });

  it('should display the Contact Us section', () => {
    // Verify if the Contact Us header is present and visible
    cy.get('h2')
      .contains('Contact Us')
      .should('be.visible');
    
    // Verify the contact information is present
    cy.get('p')
      .contains('Phone: +94 123 456 789')
      .should('be.visible');
    
    cy.get('p')
      .contains('Email: support@laplanka.lk')
      .should('be.visible');
    
    cy.get('p')
      .contains('Address: 123 Main Street, Colombo, Sri Lanka')
      .should('be.visible');
  });

  it('should display the contact form', () => {
    // Verify the form fields are visible
    cy.get('input[placeholder="Your Name"]').should('be.visible');
    cy.get('input[placeholder="Your Email"]').should('be.visible');
    cy.get('textarea[placeholder="Your Message"]').should('be.visible');
    
    // Check the Send Message button
    cy.get('button').contains('Send Message').should('be.visible');
  });

  it('should fill and submit the contact form', () => {
    // Fill in the form fields
    cy.get('input[placeholder="Your Name"]').type('John Doe');
    cy.get('input[placeholder="Your Email"]').type('johndoe@example.com');
    cy.get('textarea[placeholder="Your Message"]').type('This is a test message.');

    // Submit the form
    cy.get('button').contains('Send Message').click();
  });
});
