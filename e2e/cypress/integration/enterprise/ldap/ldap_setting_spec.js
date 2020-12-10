// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. #. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @ldap

// assumes the CYPRESS_* variables are set
// assumes that E20 license is uploaded
// for setup with AWS: Follow the instructions mentioned in the mattermost/platform-private/config/ldap-test-setup.txt file

describe('LDAP Group Sync Automated Tests', () => {
    beforeEach(() => {
        // ogin as sysadmin
        cy.apiAdminLogin();

        // Check if server has license for LDAP
        cy.apiRequireLicenseForFeature('LDAP');
    });
    it('MM-T2699 Connection test button - Successful', () => {
        // # Load AD/LDAP page in system console
        cy.visit('/admin_console/authentication/ldap');

        // click "AD/LDAP Test"
        cy.findByRole('button', {name: /ad\/ldap test/i}).click();

        // * Confirmation message saying the connection is successful.
        cy.findByText(/ad\/ldap test successful/i).should('be.visible');
        cy.findByTitle(/success icon/i).should('be.visible');
    });
    it('MM-T2700 LDAP username required', () => {
        cy.visit('/admin_console/authentication/ldap');

        // * Remove text from Username Attribute
        cy.get('[data-testid="LdapSettings.UsernameAttributeinput"]').click().clear();

        // # Click Save
        cy.findByText(/save/i).click();

        // * Error message "AD/LDAP field "Username Attribute" is required."
        cy.findByText(/ad\/ldap field "username attribute" is required./i).should('be.visible');
        cy.get('.col-sm-12 > .control-label').should('be.visible');

        // * Set back to what it was
        cy.get('[data-testid="LdapSettings.UsernameAttributeinput"]').click().type('uid');
        cy.findByText(/save/i).click();
        cy.findByRole('button', {name: /save/i}).should('be.disabled');
    });
    it('MM-T2701 LDAP LoginidAttribute required', () => {
        cy.visit('/admin_console/authentication/ldap');

        // * Try to save LDAP settings with blank Loginid
        cy.get('[data-testid="LdapSettings.LoginIdAttributeinput"]').click().clear();
        cy.findByText(/save/i).click();
        cy.findByText(/ad\/ldap field "login id attribute" is required./i).should('be.visible');
    });
    it('MM-T2704 Create new LDAP account from login page', () => {
        const testSettings =
        {
            user: {
                username: 'test.one',
                password: 'Password1',
            },
            siteName: 'Mattermost',
        };

        // # Login as a new LDAP user
        cy.doLDAPLogin(testSettings);

        // Verify user is logged in  Successfy
        cy.findByText(/logout/i).should('be.visible');
    });
});
