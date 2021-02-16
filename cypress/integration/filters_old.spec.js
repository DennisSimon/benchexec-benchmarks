const localAddress = Cypress.env('oldBase');

for (let i = 0; i < 10; i++) {
  describe(`filter functionality test::iteration ${i + 1}`, () => {
    it('should filter numeric ranges', () => {
      cy.visit(localAddress);
      cy.contains('Table').click();
      cy.get('#0_cputime_1_filter').type('10:800');
      cy.contains('Reset Filters');
    });

    it('should filter status/category values', () => {
      cy.visit(localAddress);
      cy.contains('Table').click();
      cy.contains('Show all').parents('select').select('error ');
      cy.contains('Reset Filters');
    });

    it('should filter task ids', () => {
      cy.visit(localAddress);
      cy.contains('Table').click();
      cy.get('#id_filter').type('a');
      cy.contains('Reset Filters');
    });
  });
}
