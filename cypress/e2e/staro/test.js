/* eslint-disable no-param-reassign */
/// <reference types="Cypress" />

import dayjs from 'dayjs';

const RandExp = require('randexp');

Cypress.Commands.add('getBySel', (selector, ...args) => {
  // return cy.get(`[data-test=${selector}]`, ...args);
  cy.get(`[data-test=${selector}]`, ...args);
});
Cypress.Commands.add('login', (email, password) => {
  cy.session(
    email,
    () => {
      cy.intercept('*stratos-id/languages').as('lang');
      cy.visit('/login', { timeout: 6000 });
      cy.wait('@lang').its('response.statusCode').should('eq', 200);
      cy.getBySel('email').type(email);
      cy.getBySel('password').type(password, { log: false });
      cy.getBySel('login').realClick();
      cy.url().should('be.eq', `${Cypress.config().baseUrl}/`);
    },
    {
      validate() {
        cy.url().should('contain', `${Cypress.config().baseUrl}/`);
        cy.url().should('not.contain', '/login');
      },
      cacheAcrossSpecs: true,
    },
  );
  cy.visit('/');
});
Cypress.Commands.add('adminLogin', (email, password) => {
  cy.session(
    email,
    () => {
      cy.intercept('*stratos-id/languages').as('lang');
      cy.visit('admin/login', { timeout: 6000 });
      cy.wait('@lang');
      cy.getBySel('email').type(email);
      cy.getBySel('password').type(password, { log: false });
      cy.getBySel('login').realClick();

      cy.contains('Use your authentication app one time password')
        .should('be.visible');
      cy.getBySel('"otp.0"')
        .type('0');
      cy.getBySel('"otp.1"')
        .type('1');
      cy.getBySel('"otp.2"')
        .type('2');
      cy.getBySel('"otp.3"')
        .type('3');
      cy.getBySel('"otp.4"')
        .type('4');
      cy.getBySel('"otp.5"')
        .type('5');
      cy.getBySel('submit-otp')
        .click();
      cy.url().should('be.eq', `${Cypress.config().baseUrl}/admin/dashboard?page=1&size=10`);
    },
    {
      validate() {
      },
      cacheAcrossSpecs: true,
    },
  );
  // cy.visit('/');
});
Cypress.Commands.add('getToken', () => {
  cy.window().then(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token.access_token) {
      Cypress.env('token', token); // Store the token in Cypress environment
      return token.access_token;
    }
    throw new Error('Token not found in local storage');
  });
});
Cypress.Commands.add('loginAsStratosAdmin', () => {
  cy.adminLogin(Cypress.env('USER_STRATOS_ADMIN_EMAIL'), Cypress.env('USER_STRATOS_ADMIN_PASSWORD'));
});
Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.login(Cypress.env('USER_SUPER_ADMIN_EMAIL'), Cypress.env('USER_SUPER_ADMIN_PASSWORD'));
  cy.openApp('Workstation', '/workstation/#/');
  cy.getBySel('refresh').as('btn');
  cy.get('@btn').should('be.visible');
  cy.getToken();
});
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('USER_ADMIN_EMAIL'), Cypress.env('USER_ADMIN_PASSWORD'));
  cy.openApp('Workstation', '/workstation/#/');
  cy.getBySel('refresh').as('btn');
  cy.get('@btn').should('be.visible');
  cy.getToken();
});
Cypress.Commands.add('loginAsOperater', () => {
  cy.login(Cypress.env('USER_OPERATOR_EMAIL'), Cypress.env('USER_OPERATOR_PASSWORD'));
  cy.openApp('Workstation', '/workstation/#/');
  cy.getBySel('refresh').as('btn');
  cy.get('@btn').should('be.visible');
  cy.getToken();
});
Cypress.Commands.add('loginAsSupervisor', () => {
  cy.login(Cypress.env('USER_GARAGE_SUPERVISOR_EMAIL'), Cypress.env('USER_GARAGE_SUPERVISOR_PASSWORD'));
  cy.getBySel('ticket-details').as('detailsLink');
  cy.visit('/');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('@detailsLink').then(($elements) => {
    if ($elements.length > 0) {
      cy.url().should('be.equal', `${Cypress.config('baseUrl')}/garage-dashboard/`);
      // cy.onboardingFlag(true);
      cy.getToken();
      cy.setNotifications();
      cy.getBySel('nav-users', { timeout: 10000 }).should('be.visible');
    }
    cy.saveLocalStorage();
  });
});
Cypress.Commands.add('loginAsGarageAdvisor', () => {
  cy.login(Cypress.env('USER_GARAGE_ADVISOR_EMAIL'), Cypress.env('USER_GARAGE_ADVISOR_PASSWORD'));
  // cy.intercept(`${Cypress.env('apiRoute')}/tickets?*`).as('tickets');
  cy.getBySel('ticket-details').as('detailsLink');
  cy.visit('/');
  // cy.wait('@tickets').its('response.statusCode').should('eq', 200);
  cy.get('@detailsLink').then(($elements) => {
    if ($elements.length > 0) {
      cy.getToken();
      cy.url().should('be.equal', `${Cypress.config('baseUrl')}/garage-dashboard/`);
      // cy.onboardingFlag(true);
      cy.setNotifications();
      cy.getBySel('nav-dashboard', { timeout: 10000 }).should('be.visible');
    }
  });
});
Cypress.Commands.add('loginAsDMS', () => {
  cy.session(
    'email',
    () => {
      cy.intercept('*stratos-id/languages').as('lang');
      cy.visit('/login', { timeout: 6000 });
      cy.wait('@lang').its('response.statusCode').should('eq', 200);
      cy.getBySel('email').type(Cypress.env('USER_DMS_EMAIL'));
      cy.getBySel('password').type(Cypress.env('USER_DMS_PASSWORD'), { log: false });
      cy.getBySel('login').realClick();
      cy.url().should('be.eq', `${Cypress.config().baseUrl}/`);
    },
    {
      validate() {
        cy.url().should('be.eq', `${Cypress.config().baseUrl}/`);
      },
      cacheAcrossSpecs: true,
    },
  );
  cy.visit('/');
  cy.contains('Fleet Access API', { timeout: 10000 }).should('be.visible');
  cy.getToken();

  cy.log(cy.getToken());
});
Cypress.Commands.add('setTheDefaultLanguage', (lang) => {
  cy.request({
    method: 'PATCH',
    url: '/stratos-id/user',
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
    body: {
      locale: lang,
    },
  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.visit('/');
    cy.reload();
    cy.getBySel('nav-new-request', { timeout: 10000 }).should('be.visible');
  });
});
Cypress.Commands.add('createUserGD', (email, lang, role) => {
  cy.generateRandomPassword().then((pass) => {
    cy.wrap(pass).as('password');
    cy.getBySel('nav-users')
      .click();
    cy.getBySel('add-user')
      .click();
    cy.getBySel('language')
      .type(lang).trigger('keydown', { key: 'Enter' });
    cy.getBySel('first-name')
      .type(`Cypress${role}`);
    cy.getBySel('last-name')
      .type('Test');
    cy.getBySel('role-input')
      .type(role);
    cy.getBySel('email')
      .type(email);
    cy.getBySel('garage-info')
      .should('exist');
    cy.getBySel('save-new-user')
      .click();
    cy.contains('User created.')
      .should('be.visible');
  });
});
Cypress.Commands.add('createRequestWS', (type, garage, tenant, fileName, subject) => {
  cy.visit('/workstation');
  cy.intercept(`${Cypress.env('apiRoute')}/tenants`).as('tenants');
  cy.intercept(`${Cypress.env('apiRoute')}/service-status`).as('service');
  cy.getBySel('create-request')
    .click();
  cy.wait('@tenants');
  cy.getBySel('type')
    .select(type);
  cy.getBySel('allow-send-email')
    .should('be.visible')
    .and('be.checked');
  cy.getBySel('garage-search')
    .type(`${garage}{enter}`).parent().next('')
    .should('not.contain', 'Wird geladen')
    .and('not.contain', 'Kein Ergebnis gefunden')
    .click();
  cy.getBySel('tenant-search')
    .should('not.be.disabled')
    .type(`${tenant}`).parent()
    .next('')
    .should('not.contain', 'Kein Ergebnis gefunden')
    .click();
  cy.getBySel('from-name')
    .type('Cypress Test');
  cy.getBySel('from-email')
    .type('test@caroo.ch');
  cy.getBySel('subject')
    .type(subject);
  cy.getBySel('content')
    .type('test content');
  cy.getBySel('upload-file')
    .selectFile(`cypress/fixtures/${fileName}`, { force: true });
  cy.getBySel('attachment')
    .should('contain.text', fileName);
  cy.getBySel('remove-attachment')
    .should('be.visible');
  cy.getBySel('create')
    .should('be.enabled');
  cy.getBySel('create-and-process')
    .should('be.enabled')
    .click({ force: true });
  cy.getBySel('create-and-process')
    .should('have.not.exist');
  cy.wait('@create');
  cy.verifyCreatedRequest(subject);
});
Cypress.Commands.add('verifyCreatedRequest', (subject) => {
  cy.log('verify created request');
  cy.visitAdminUrl('/fleet-access/admin/inbox');
  cy.getBySel('filter_subject')
    .type(`${subject}{enter}`);
  cy.checkAndReloadUntilVisible(subject);
  cy.getBySel('subject')
    .should('contain', subject);
  cy.getBySel('ticket_number')
    .find('a')
    .should('contain.text', 'STR')
    .invoke('text')
    .as('strNumber');
  cy.getBySel('ticket_number')
    .find('a').click();
});
Cypress.Commands.add('onboardingFlag', (flag) => {
  cy.request({
    method: 'patch',
    url: `${Cypress.env('apiRoute')}/user/settings/onboard`,
    failOnStatusCode: false,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
    body: {
      flag: 'garage_dashboard_welcome_tour',
      value: flag,
    },

  }).then((res) => {
    expect(res.status).to.eq(204);
    cy.log(JSON.stringify(res.body));
  });
});
Cypress.Commands.add('getRequestWithRetry', (getUrl, retries = 6) => {
  function sendRequest() {
    return cy.request({
      url: getUrl,
      headers: {
        Authorization: `Bearer ${Cypress.env('token').access_token}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 401 && retries > 0) {
        cy.log(`Received 401, retrying... (${3 - retries + 1})`);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        return cy.getRequestWithRetry(getUrl, retries - 1); // Retry the request
      }
      expect(response.status).to.eq(200);
      return response;
    });
  }

  return sendRequest();
});
Cypress.Commands.add('getTenantOfGarage', (request, garage) => {
  const getUrl = `${Cypress.env('apiRoute')}/garages?filter[name]=${garage}`;
  cy.getToken();
  cy.getRequestWithRetry(getUrl);
  cy.request({
    method: 'GET',
    url: getUrl,
    retry: 3,
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
  }).then((response) => {
    expect(response.status).eq(200);
    const garageName = response.body.data[0].name;
    const garageId = response.body.data[0].id;
    const splitText = garageName.split(' ')[0];
    const garAddress = response.body.data[0].address;
    const garVat = response.body.data[0].vat_number;
    const garCity = response.body.data[0].city;
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiRoute')}/garages/${garageId}/tenants`,
      headers: {
        Authorization: `Bearer ${Cypress.env('token').access_token}`,
      },
    }).then((res) => {
      expect(res.status).eq(200);
      const tenantName = res.body[0].name;
      const tenantId = res.body[0].tenant_id;
      const outletId = res.body[0].garage_tenant.outlet_id;
      cy.wrap(tenantName).as('tenant');
      cy.writeFile(`cypress/fixtures/${request}.json`, {
        garage: splitText,
        fullGarageName: garageName,
        garage_id: garageId,
        garage_address: garAddress,
        garage_vat: garVat,
        garage_city: garCity,
        tenant_id: tenantId,
        tenant_outletId: outletId,
        tenant: tenantName,
        kvaNumber: '',
        kvaNumberReject: '',
        garage_outlet_id: outletId,
      });
    });
  });
});
Cypress.Commands.add('createRequestThroughGaragDashboard', () => {
  cy.readFile('cypress/fixtures/request-kva-data.json').then((data) => {
    cy.getBySel('nav-new-request')
      .click();
    cy.getBySel('upload-file')
      .selectFile('cypress/fixtures/KVA-testing-anon.pdf', { force: true });
    cy.getBySel('garage').eq(1)
      .type(`${data.garage}{enter}`)
      .should('contain.text', data.garage);

    cy.getBySel('tenant')
      .type(`${data.tenant}{enter}`, { delay: 100 })
      .should('contain.text', data.tenant);

    cy.getBySel('create-request')
      .click({ force: true });
    cy.getBySel('create-request')
      .should('have.not.exist');
    cy.visit('/garage-dashboard/');
    const currentTime = dayjs().format('HH:mm');
    cy.getBySel('ticket-details', { timeout: 10000 }).should('be.visible');
    cy.log(currentTime);
    cy.intercept('**order_by=desc&status=KVA_IN_PROGRESS').as('kva');
    cy.getBySel('status')
      .type('KVA_IN_PROGRESS{enter}');
    cy.wait('@kva');
    cy.getBySel('ticket-details')
      .parent().parent().first()
      .should('contain.text', currentTime);
    cy.getBySel('ticket-details')
      .first()
      .click();
    cy.getBySel('ticket-number')
      .should('be.visible')
      .should('not.be.empty');
  });
});
Cypress.Commands.add('createDirectInvoiceThroughGaragDashboard', () => {
  cy.readFile('cypress/fixtures/request-invoice-data.json').then((data) => {
    cy.getBySel('nav-direct-invoice')
      .click();
    cy.getBySel('upload-file')
      .selectFile('cypress/fixtures/dirinvoice.pdf', { force: true });
    cy.getBySel('garage').eq(1)
      .type(`${data.garage}{enter}`)
      .should('contain.text', data.garage);

    cy.getBySel('tenant')
      .type(`${data.tenant}{enter}`, { delay: 100 })
      .should('contain.text', data.tenant);

    cy.getBySel('create-request')
      .click({ force: true });
    cy.getBySel('create-request')
      .should('have.not.exist');
    cy.visit('/garage-dashboard/');
    const currentTime = dayjs().format('HH:mm');
    cy.getBySel('ticket-details', { timeout: 10000 }).should('be.visible');
    cy.log(currentTime);
    cy.intercept('**order_by=desc&status=INVOICE_IN_PROGRESS').as('invoice');
    cy.getBySel('status')
      .type('Invoice Extracting{enter}');
    cy.wait('@invoice');
    cy.getBySel('ticket-details')
      .parent().parent().first()
      .should('contain.text', currentTime);
    cy.getBySel('ticket-details')
      .first()
      .click();
    cy.getBySel('ticket-number')
      .should('be.visible')
      .should('not.be.empty');
    cy.getBySel('invoice-in-progress')
      .should('contain.text', 'Invoice Extracting');
    cy.contains(/^Direct$/);
  });
});
Cypress.Commands.add('createRequestThroughAPI', (garage, jsonFile, pdfFile, filePath, urlPath) => {
  // cy.setTheDefaultLanguage('en');
  cy.getTenantOfGarage(jsonFile, garage);

  cy.readFile(filePath).then((data) => {
    cy.fixture(`${pdfFile}.pdf`, 'binary')
      .then((binary) => Cypress.Blob.binaryStringToBlob(binary))
      .then((documentFile) => {
        cy.log(documentFile);
        const formData = new FormData();
        formData.append('document_file', documentFile, `${pdfFile}.pdf`);
        formData.append('garage_id', data.garage_id);
        formData.append('tenant_id', data.tenant_id);

        cy.request({
          url: `${Cypress.env('apiRoute')}/${urlPath}`,
          method: 'POST',
          body: formData,
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${Cypress.env('token').access_token}`,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          cy.log(response);
          const arrayBuffer = response.body;
          const decoder = new TextDecoder('utf-8');
          const responseBodyString = decoder.decode(arrayBuffer);
          cy.log(responseBodyString);
          const responseBodyJSON = JSON.parse(responseBodyString);
          const ticketId = responseBodyJSON.ticket_id;
          cy.wrap(ticketId).as('ticketId');

          if (urlPath === 'direct-invoices') {
            cy.request({
              method: 'GET',
              url: `${Cypress.env('apiRoute')}/tickets/${ticketId}?with=invoice`,
              headers: {
                Authorization: `Bearer ${Cypress.env('token').access_token}`,
              },
            }).then((res) => {
              expect(res.status).eq(200);
              const ticketNumber = res.body.ticket_number;
              const StrNumber = res.body.invoice.ticket_number;
              const UUID = res.body.invoice.uuid;
              cy.log(UUID);
              cy.wrap(UUID).as('UUID');
              cy.log(ticketNumber);
              cy.readFile(filePath).then((dataa) => {
                cy.writeFile(
                  filePath,
                  {
                    fullGarageName: dataa.fullGarageName,
                    garage: dataa.garage,
                    tenant: dataa.tenant,
                    uuid: UUID,
                    kvaNumber: ticketNumber,
                    invoiceSTR: StrNumber,
                    fgn: '/',
                  },
                );
              });
            });
          } else {
            cy.request({
              method: 'GET',
              url: `${Cypress.env('apiRoute')}/tickets/${ticketId}?with=offer`,
              headers: {
                Authorization: `Bearer ${Cypress.env('token').access_token}`,
              },
            }).then((res) => {
              expect(res.status).eq(200);
              const UUID = res.body.offer.uuid;
              cy.log(UUID);
              cy.wrap(UUID).as('UUID');
              const ticketNumber = res.body.ticket_number;
              const StrNumber = res.body.offer.ticket_number;
              cy.log(ticketNumber);
              cy.readFile(filePath).then((dataa) => {
                cy.writeFile(
                  filePath,
                  {
                    fullGarageName: dataa.fullGarageName,
                    garage: dataa.garage,
                    tenant: dataa.tenant,
                    uuid: UUID,
                    kvaNumber: ticketNumber,
                    invoiceSTR: StrNumber,
                    fgn: '/',
                  },
                );
              });
            });
          }
        });
      });
  });
});
Cypress.Commands.add('getIframe', (lang, uniqueText) => {
  cy.getBySel(`editor-${lang}`)
    .should('be.visible')
    .then(($iframe) => {
      const $body = $iframe.contents().find('body');
      cy.wrap($body)
        .type(uniqueText);
    });
});
Cypress.Commands.add('createUserAPI', (mail, lang, userRole) => {
  cy.generateRandomPassword().then((pass) => {
    cy.wrap(pass).as('password');
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiRoute')}/garages?filter[name]=Test Garage`,
      headers: {
        Authorization: `Bearer ${Cypress.env('token').access_token}`,
      },
    }).then((response) => {
      expect(response.status).eq(200);
      const garageId = response.body.data[0].id;
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiRoute')}/users`,
        headers: {
          Authorization: `Bearer ${Cypress.env('token').access_token}`,
        },
        body: {
          // TODO -> izvuci garage id kroz api
          garages: [garageId],
          authentication_types: ['CREDENTIALS'],
          confirm_password: pass,
          password: pass,
          role: userRole, // 6 = supervisor, 7 = advisor
          locale: lang,
          phone: '+41435080624', // Stratos contact phone number from from FA
          email: mail,
          last_name: 'Cypresslastname',
          first_name: 'Cypressuser',
        },
      }).then((res) => {
        expect(res.status).to.eq(201);
        if (userRole === 6) { // 6 = supervisor
          const userID = res.body.id;
          cy.visit(`/admin/users/${userID}/edit`);
          cy.getBySel('two_factor_authentication_type')
            .should('be.enabled')
            .select('SMS');
          cy.getBySel('create')
            .click();
          cy.getBySel('alert')
            .should('contain.text', 'Successfully updated!');
          cy.url().should('not.contain', '/create');
        } else {
          cy.log('advisor rola');
          const userID = res.body.id;
          cy.visit(`/admin/users/${userID}/edit`);
          cy.getBySel('status')
            .select('Active');
          cy.getBySel('create')
            .click();
          cy.getBySel('alert')
            .should('contain.text', 'Successfully updated!');
          cy.url().should('not.contain', '/create');
        }
      });
    });
  });
});
Cypress.Commands.add('createUserStratosAPI', (mail, lang, tech, auth) => {
  cy.request({
    method: 'POST',
    url: '/stratos-id/admin/users',
    headers: {
      Authorization: `Bearer ${Cypress.env('stratosid_session')}`,
    },
    body: {
      technical: tech,
      authentication_type: auth,
      locale: lang,
      phone: '+41435080624', // Stratos contact phone number from from FA
      email: mail,
      last_name: 'Cypresslastname',
      first_name: 'Cypressuser',
    },
  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.log(res);
  });
});
Cypress.Commands.add('deleteUserStratosAPI', (uuid) => {
  cy.request({
    method: 'DELETE',
    url: `/stratos-id/admin/users/${uuid}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('stratosid_session')}`,
    },
  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.log(res);
  });
});
Cypress.Commands.add('setNotifications', () => {
  cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiRoute')}/user/settings/notifications`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
    body: {
      notifications: {
        email: [
          'INVOICE_MANUAL_REJECTED',
          'INVOICE_APPROVED_PENDING',
          'OFFER_MANUAL_REJECTED',
          'OFFER_APPROVED_PENDING',
          'TICKET_MESSAGE',
          'REQUEST_STARTED',
          'PARKED_IN_MMI',
          'OFFER_APPROVED',
          'OFFER_REJECTED',
          'INVOICE_APPROVED',
          'INVOICE_REJECTED',
        ],
        sms: [],
        push: [],
      },
    },
  }).then((res) => {
    expect(res.status).to.eq(204);
  });
});
Cypress.Commands.add('wsOpenTicketAndAssigne', (strOrTn, type, data) => {
  cy.getBySel(`${strOrTn}-number`)
    .type(data.kvaNumber, { force: true })
    .then(() => {
      cy.getBySel(type)
        .click({ force: true });
      cy.wait('@list', { timeout: 30000 });
    });

  if (type === 'invoice-tab') {
    cy.log('invoice');
    cy.intercept(`${Cypress.env('apiRoute')}/calculation/*`).as('calc');
    cy.getBySel('review').parent().parent({ timeout: 61000 })
      .should('contain', 'Validation');
  } else {
    cy.intercept(`${Cypress.env('apiRoute')}/calculation/*`).as('calc');
    cy.getBySel('review').parent().parent({ timeout: 61000 })
      .should('contain', 'Validation');
  }
  cy.getBySel('review')
    .should('be.visible')
    .click()
    .then(() => {
      cy.intercept('**/stratos-codes').as('stratosCodes');
      cy.intercept(`${Cypress.env('apiRoute')}/tenants*`).as('tenants');
      cy.intercept('**/assign-user').as('assign');
      cy.getBySel('data-extractor')
        .should('be.visible');
      cy.wait('@calc');
      cy.getBySel('assign-user')
        .type('{enter}');
      cy.wait('@assign');
      cy.contains('Request has been assigned to user')
        .should('be.visible');
    });
});
Cypress.Commands.add('createUserAdmin', (email, auth) => {
  // create user
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  cy.visit('/admin/user-management');
  cy.getBySel('open-add-user')
    .click();
  cy.getBySel('first-name')
    .type(`Cypress${Date.now()}`);
  cy.getBySel('last-name')
    .type('Test');
  cy.getBySel('email')
    .type(email);
  cy.getBySel('phone')
    .type(`+38166${randomNumber}`);
  cy.get(':nth-child(4) > .css-b62m3t-container > .select2__control > .select2__value-container > .select2__input-container')
    .click()
    .type(`${auth}{enter}`);
  cy.getBySel('add-user')
    .click();
  cy.contains('User added')
    .should('be.visible');
});
Cypress.Commands.add('saveAndReprocess', (text) => {
  cy.intercept('**/update').as('update');
  cy.getBySel('save-reprocess')
    .click();
  cy.getBySel('yes')
    .click();
  cy.wait('@update');
  cy.getBySel('save-reprocess')
    .should('have.not.exist');
  cy.getBySel('refresh')
    .click({ force: true });
  cy.getBySel('review').parent().parent({ timeout: 61000 })
    .should('not.contain', 'Processing mail')
    .should('contain', text);
  cy.getBySel('review')
    .click();
});
Cypress.Commands.add('generateRandomPassword', () => {
  const allowedChars = ['@', '%', '+', '/', "'", '!', '#', '$', '^', '?', ':', '.', '(', ')', '{', '}', '[', ']', '~', '`', '-', '_', '.'];
  let specialChars = '';
  const randRegex = new RandExp('^[A-Z]{3}[a-z]{3}\\d{3}$').gen();
  for (let i = 0; i < 3; i += 1) {
    specialChars += Cypress._.sample(allowedChars);
  }
  const password = randRegex + specialChars;
  // const password = specialChars;
  return password;
});
Cypress.Commands.add('deleteUserByEmail', (email) => {
  // delete user by email
  cy.log('change to stratos admin');
  cy.loginAsStratosAdmin();
  cy.visit('/admin/user-management');
  cy.getBySel('search')
    .type(email);
  cy.getBySel('go-to-user-info')
    .should('be.visible')
    .click();
  cy.getBySel('open-delete-user')
    .click({ force: true });
  cy.getBySel('delete-user')
    .should('be.visible')
    .click({ force: true });
  cy.contains('User deleted')
    .should('be.visible');
});
Cypress.Commands.add('createTenant', (ruleEngine, nmb) => {
  const tenantId = `${ruleEngine}${nmb}`;
  cy.visitAdminUrl('fleet-access/admin/tenants');
  cy.getBySel('create')
    .click();
  cy.getBySel('name')
    .type(`TEST${nmb}`);
  cy.getBySel('tenant_id')
    .type(tenantId);
  cy.getBySel('status')
    .check({ force: true });
  cy.getBySel('address')
    .type('Gontenstrasse{enter}');
  cy.getBySel('city')
    .type('Zürich');
  cy.getBySel('zip')
    .type('8004');

  cy.getBySel('country')
    .select('Switzerland CH');
  cy.getBySel('direct_invoice')
    .check({ force: true });
  cy.getBySel('direct_invoice_limit')
    .type('300');
  cy.getBySel('invoice_tolerance_level').first()
    .type('20');
  cy.getBySel('minimum_mileage')
    .type('1');
  cy.getBySel('rule_engine')
    .select(ruleEngine);

  cy.getBySel('rule_engine')
    .find(`option[value="${ruleEngine}"]`)
    .should('have.prop', 'selected', true);

  cy.getBySel('create')
    .click();
  cy.getBySel('alert')
    .should('contain.text', 'Successfully created!');

  // assign rule to tenant
  // TODO add as a separate command
  cy.api({
    method: 'POST',
    url: `${Cypress.env('popeyeUrl')}/api/v1/rule-management/tenant/${tenantId}/enable-rule`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
    body: {
      rule_id: 'abstractrs.stratos.popeye.rules.offer.MileageOvershotRule',
    },

  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.log(JSON.stringify(res.body));
  });
});
Cypress.Commands.add('createGarage', (nmb) => {
  const garageName = `TEST${nmb}`;
  cy.visitAdminUrl('/fleet-access/admin/repair-shop');
  cy.getBySel('create')
    .click();
  cy.contains('add new contact')
    .click();
  cy.getBySel('name')
    .type(garageName);
  cy.getBySel('vat_number')
    .type('CHE-101.237.930');
  cy.getBySel('status')
    .select('ACTIVE');
  cy.getBySel('notification_email_calculation')
    .type('examplecalc@caroo.ch');
  cy.getBySel('notification_email_invoice')
    .type('exampleinvoice@caroo.ch');
  cy.getBySel('address')
    .type('Gontenstrasse{enter}');
  cy.getBySel('city')
    .type('Geneve');
  cy.getBySel('zip')
    .type('1200');
  cy.getBySel('locale')
    .select('en');
  cy.getBySel('dms_provider_id')
    .click();
  cy.getBySel('dms-provider-id_results')
    .type('My provider{enter}');
  cy.getBySel('dms_solution_id')
    .click();
  cy.getBySel('dms-solution-id-results')
    .should('have.text', 'My Solution')
    .click();
  cy.getBySel('"first_name[]"')
    .type('Testname');
  cy.getBySel('"last_name[]"')
    .type('Testlastname');
  cy.getBySel('"email_contact"')
    .type(Cypress.env('USER_GARAGE_ADVISOR_EMAIL'));
  cy.getBySel('kva_information')
    .type('kva test');
  cy.getBySel('invoice_information')
    .type('kva test');
  cy.getBySel('create')
    .click();
  cy.getBySel('alert')
    .should('contain.text', 'Successfully created!');
});
Cypress.Commands.add('addRelationGarageTenant', (garageName, tenant) => {
  cy.openGarageOrTenantPage(garageName, 'repair-shop');
  cy.getBySel('edit')
    .click({ force: true });
  cy.getBySel('tenants').next()
    .click();
  cy.focused().type(`${tenant}{enter}`);
  cy.getBySel('outlet-id')
    .should('be.visible');
  cy.getBySel('outlet-id')
    .type(tenant);
  cy.getBySel('qty_type').select('H', { force: true });
  cy.contains('Clear').prev()
    .click();
  cy.getBySel('alert').should('contain.text', 'Successfully updated!');
});
Cypress.Commands.add('deleteTenant', (tenantId) => {
  cy.openGarageOrTenantPage(tenantId, 'tenants');
  cy.getBySel('delete')
    .click({ force: true });
  cy.getBySel('alert').should('contain.text', 'Successfully deleted!');
});
Cypress.Commands.add('deleteGarage', (garage) => {
  cy.openGarageOrTenantPage(garage, 'repair-shop');
  cy.getBySel('delete')
    .click({ force: true });
  cy.getBySel('alert')
    .should('contain.text', 'Successfully deleted!');
});
Cypress.Commands.add('editTenant', (tenantId, RE) => {
  cy.openGarageOrTenantPage(tenantId, 'tenants');
  cy.getBySel('edit')
    .click({ force: true });
  cy.getBySel('rule_engine')
    .select(RE);
  cy.getBySel('create')
    .click();
  cy.getBySel('alert')
    .should('contain.text', 'Successfully updated!');
});
Cypress.Commands.add('checkAndReloadUntilVisible', (tekst) => {
  // eslint-disable-next-line no-unused-vars
  const checkAndReload = () => {
    let attempts = 0;
    const maxAttempts = 10;
    const tryReload = () => {
      // eslint-disable-next-line no-plusplus
      attempts++;
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(700);
      cy.get('td')
        .invoke('text')
        .then((text) => {
          if (text.includes(tekst)) {
            return;
          }
          if (attempts < maxAttempts) {
            cy.reload();
            tryReload();
          } else {
            cy.log('Max attempts reached, condition not met.');
          }
        });
    };
    tryReload();
  };
  checkAndReload(tekst);
});
Cypress.Commands.add('getUrlUUID', (val) => {
  cy.url().then((url) => {
    const splitUrl = url.split('/')[5];
    cy.log(splitUrl);

    cy.api({
      method: 'get',
      url: `${Cypress.env('apiRoute')}/tickets/${splitUrl}?with=${val}`,
      headers: {
        Authorization: `Bearer ${Cypress.env('token').access_token}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      cy.log(JSON.stringify(res.body));
      const UUID = res.body[val].uuid;
      cy.log(UUID);
      cy.wrap(UUID).as('UUID');
    });
  });
});
Cypress.Commands.add('apiAssignAndDeleteRequest', () => {
  cy.get('@UUID').then((uuid) => {
    cy.log('get id of logged user');
    cy.APIgetUserID();
    cy.get('@userId').then((userId) => {
      cy.APIassignUser(uuid, userId);
    });
    cy.log('delete request');
    cy.APIdeleteRequestByUUID(uuid);
  });
});
Cypress.Commands.add('openGarageOrTenantPage', (garageTenantName, url) => {
  cy.visitAdminUrl(`/fleet-access/admin/${url}`);
  cy.log(garageTenantName, url);
  cy.getBySel('name').eq(0)
    .type(garageTenantName);
  cy.getBySel('filter')
    .click();
  cy.getBySel('name').eq(1)
    .should('contain.text', `TEST${garageTenantName}`);
  cy.getBySel('status').then(($ele) => {
    expect($ele.text().toLowerCase()).to.contain('active');
  });
});
Cypress.Commands.add('APIgetUserID', () => {
  cy.api({
    method: 'get',
    url: `${Cypress.env('apiRoute')}/user`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
  }).then((res) => {
    expect(res.status).to.eq(200);
    const userId = res.body.id;
    cy.wrap(userId).as('userId');
  });
});
Cypress.Commands.add('APIassignUser', (uuid, userId) => {
  cy.api({
    method: 'post',
    url: `${Cypress.env('apiRoute')}/calculation/${uuid}/assign-user`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
    body: {
      user_id: userId
      ,
    },
  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.log(JSON.stringify(res.body));
  });
});
Cypress.Commands.add('APIdeleteRequestByUUID', (uuid) => {
  cy.api({
    method: 'post',
    url: `${Cypress.env('apiRoute')}/calculation/${uuid}/delete`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token').access_token}`,
    },
  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.log(JSON.stringify(res.body));
  });
});
Cypress.Commands.add('loginStratosApi', (email, password) => {
  cy.session(
    email,
    () => {
      cy.visit('/login', { timeout: 6000 });
      cy.getBySel('email').type(email);
      cy.getBySel('password').type(password, { log: false });
      cy.getBySel('login').click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
    },
    {
      validate() {
      },
      cacheAcrossSpecs: true,
    },
  );
  cy.visit('/');
});
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.session(email, () => {
    cy.api({
      method: 'POST',
      url: '/web/login',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        locale: 'en',
      },
      json: true,
      body: { email, password },
    }).then((res) => {
      cy.log(res.body.metadata.message);
      cy.log('Set-Cookie Header:', res.headers['set-cookie']);

      const cookies = res.headers['set-cookie'];

      if (cookies) {
        // Find the specific cookie
        const stratosIdSession = cookies.find((cookie) => cookie.startsWith('stratos_id_session'));

        if (stratosIdSession) {
          // Log the specific cookie
          cy.log(stratosIdSession);
        } else {
          cy.log('stratos_id_session Cookie not found');
        }
      } else {
        cy.log('No set-cookie headers found');
      }
    });
  });
});
Cypress.Commands.add('openApp', (name, url) => {
  cy.visit('/');

  cy.contains(name)
    .invoke('attr', 'href')
    .then(() => {
      cy.visit(url);
      cy.url()
        .should('include', url);
    });
  Cypress.Commands.add('visitAdminUrl', (link) => {
    cy.openApp('Fleet Access Admin Dashboard', '/fleet-access/admin/dashboard');
    cy.visit(`${link}`, {
      onBeforeLoad: (win) => {
        Object.defineProperty(win, 'self', {
          get: () => window.top,
        });
      },
    });
  });
});