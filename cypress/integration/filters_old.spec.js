const localAddress = Cypress.env('oldBase');

for (let i = 0; i < 10; i++) {
  describe(`filter functionality test::iteration ${i + 1}`, () => {
    it('navigate1', () => {
      cy.visit(localAddress);
      cy.contains('Table').click();
    });
    it('should filter numeric ranges', () => {
      cy.get('#0_cputime_1_filter').type('10:800');
      cy.contains('Reset Filters');
    });

    it('navigate2', () => {
      cy.visit(localAddress);
      cy.contains('Table').click();
    });

    it('should filter status/category values', () => {
      cy.contains('Show all').parents('select').select('error ');
      cy.contains('Reset Filters');
    });

    it('navigate3', () => {
      cy.visit(localAddress);
      cy.contains('Table').click();
    });

    it('should filter task ids', () => {
      cy.get('#id_filter').type('a');
      cy.contains('Reset Filters');
    });
  });
}
