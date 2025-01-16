/// <reference types="cypress" />

beforeEach(function() {
  cy.fixture('example').then(function (data) {
    this.data = data
  })
  })


describe(' API testing ', () => {

  let randUser = Math.floor(Math.random() * 10) + 1;
  

    it('a) Get a random user by ID', () => {
    
        cy.request({
          
          method: 'get',
          url : `https://jsonplaceholder.typicode.com/users/${randUser}`,


        }).then((res)=>{          
          expect(res.status).to.eq( 200)
          const userEmail = res.body.email
          cy.log("user email is: " + userEmail)

          const userName = res.body.name
          cy.log("user Name is: " + userName)

          //cy.log(JSON.stringify(res))
        })
  
    })

    it('b) Get user’s associated todos', () => {
    
      cy.request({
        
        method: 'get',
        url : `https://jsonplaceholder.typicode.com/todos?userId=${randUser}`,

      }).then((response) => {  
        
        response.body.forEach((user, index) => {
          expect(user.id).to.be.within(1, 200)
        })

        let completed = []

        response.body.forEach((user, index) => {
          
          if(user.completed === true) {
            completed.push(user)
          }
          
        })

        cy.log("count of -completed- items is: " + completed.length)

      })

  })

  it('c) create todo',function (){

    cy.request('POST', `https://jsonplaceholder.typicode.com/todos/?userId=${randUser}`, 
    { title: 'testetstststs' }).then(
  (res) => {
    expect(res.body).to.have.property('title', 'testetstststs')
    expect(res.status).to.eq( 201)

  })
    })
  })