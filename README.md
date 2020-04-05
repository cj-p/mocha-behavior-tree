# mocha-behavior-tree

Hierarchical step definition for Mocha

[![NPM](http://img.shields.io/npm/v/mocha-behavior-tree.svg?style=flat-square)](https://npmjs.org/package/mocha-behavior-tree)
[![License](http://img.shields.io/npm/l/mocha-behavior-tree.svg?style=flat-square)](https://github.com/cj-p/mocha-behavior-tree)

Easily defining multiple next steps to test from the current state with a tree structure hierarchically for reducing duplication of test code and performing tests in a natural sequence of actions.

## Install
```sh
npm i -D mocha mocha-behavior-tree
```
```js
const { step } = require('mocha-behavior-tree')
```

## Usage

```ts
//basic api
step(stepName:string, stepFunction:function, ...nextSteps:Step[]):Step;

//bdd style api
given(stepName:string, stepFunction:function, ...nextSteps:Step[]):Step;
when(stepName:string, stepFunction:function, ...nextSteps:Step[]):Step;
then(stepName:string, stepFunction:function, ...nextSteps:Step[]):Step;
and(stepName:string, stepFunction:function, ...nextSteps:Step[]):Step;
scenario(scenarioName:string, Step):Mocha.SuiteFunction;
```

### Basic Example

Given that there are below test cases:

- user login - list products - add the first product to cart
- user login - list products - puchase the first products
- user login - list products - select all products on the page - add selected products to cart
- user login - list products - select all products on the page - puchase selected products

When they can be organized like this:

- user login
  - list products
    - add the first product to cart
    - puchase the first products
    - select all products on the page
      - add selected products to cart
      - puchase selected products

And they are tested like this :

```js
const { step } = require('mocha-behavior-tree')

describe('User', 
  step('user login', () => { /*...*/ },
    step('list products', () => { /*...*/ },
      step('add the first product to cart', () => { /*...*/ }),
      step('puchase the first products', () => { /*...*/ }),
      step('select all products on the page', () => { /*...*/ },
        step('add selected products to cart', () => { /*...*/ }),
        step('puchase selected products', () => { /*...*/ }),
      ),
    )
  )
)
```

Then the results are like below :

```yaml
User purchases products
   User login
     List products
       Add the first product to cart
         ✓ The product is in the cart
       Puchase the first products
         ✓ An order for the product is created
       Select all products on the page
         ✓ all products are selected
         Add selected products to cart
           ✓ The products are in the cart
         Puchase selected products
           ✓ Orders for the products are created
```

### Scenario, Given, When, Then

The library offers `scenario`, which is proxy for `describe`,  
and `given`,`when`,`then`,`and` methods, which are proxies for `step`,  
just adding BDD style keywords as prefix to the step name.

```js
const { scenario, given, when, then, and } = require('mocha-behavior-tree')

scenario('User purchases products', 
  given('User login', () => { /*...*/ },
    and('List products', () => { /*...*/ },
      when('Add the first product to cart', () => { /*...*/ },
        then('The product is in the cart', () => { /*...*/ })
      ),
      when('Puchase the first products', () => { /*...*/ },
        then('An order for the product is created', () => { /*...*/ })
      ),
      when('Select all products on the page', () => { /*...*/ },
        then('all products are selected', () => { /*...*/ }),
        and('Add selected products to cart', () => { /*...*/ },
            then('The products are in the cart', () => { /*...*/ })
        ),
        and('Puchase selected products', () => { /*...*/ },
            then('Orders for the products are created', () => { /*...*/ })
        ),
      ),
    )
  )
)
```

result :
```yaml
Scenario: User purchases products
   Given: User login
     And: List products
       When: Add the first product to cart
         ✓ Then: The product is in the cart
       When: Puchase the first products
         ✓ Then: An order for the product is created
       When: Select all products on the page
         ✓ Then: all products are selected
         And: Add selected products to cart
           ✓ Then: The products are in the cart
         And: Puchase selected products
           ✓ Then: Orders for the products are created
```

For integration with other test codes (or some IDE plugins), you can also do this:

```js
const { scenario, given, when, then, and } = require('mocha-behavior-tree')

describe('Shop tests', () => {
  describe('User', () => {
    scenario('User purchases products', 
      given('User login', () => { /*...*/ },
        /*...*/
      )
    )
  })
})
```

### Passing values to next Step

Each steps can return any values to be passed to the next steps function's argument.

```js
describe('test value passing',
  step('pass 1', 
    () => 1,
    step('passed value is 1', 
      number => expect(number).to.equals(1)
    )
  )
)
```

Multiple values can be passed with object key-values

```js
describe('test multiple value passing',
  step('pass 1, 2', 
    () => ({ a:1, b:2 }),
    step('passed value is 1, 2', 
      ({a, b}) => {
        expect(a).to.equals(1)
        expect(b).to.equals(2)
      }
    )
  )
)
```

Applied to above example

```js
describe('User purchases products',
  given('User', () => new User('testId'),
    and('user logged in', 
      user => {
        user.login() // returning nothing, argument will be bypassed.
      },
      and('products are listed in the page', 
        user => ({ user, page: getProductsPage({ page: 1, size: 20 }) }),
        when('Add the first product to cart', 
          ({ user, page }) => {
            const firstProduct = page.content[0]
            user.cart.add(firstProduct)
            return { cart: user.cart, firstProduct } // pass only values that will be needed for next step
          },
          then('The product is in the cart',
            ({ cart, firstProduct }) => {
              expect(cart.has(firstProduct)).to.be.true
              expect(cart.size()).to.be.equals(1)
            }
          )
        )
      )
    )
  )
)
```

### Async testing

Looking above example code, `getProductsPage` could be asyncronous function.

```js
when('products are listed in the page', 
  () => getProductsPage({ page: 1, size: 20 }).then(result => ({ page: result })), // returns promise
  then('Add the first product to cart', 
    ({ page }) => {
      // got resolved value here
    }
  )
)
```

or 

```js
when('products are listed in the page', 
  async () => ({ page : await getProductsPage({ page: 1, size: 20 }) }), // async/await
  then('Add the first product to cart', 
    ({ page }) => {
      // got resolved value here
    })
)
```

or just

```js
when('products are listed in the page', 
  () => getProductsPage({ page: 1, size: 20 }), //this also returns promise
  then('Add the first product to cart', 
    page => {
      // got resolved value here
    }
  )
)
```

### Use function name as step name

Step name can be omitted. then function name will be used to step name

```js
describe('User purchases products',
  given(function user () { 
      //... 
    },
    and(function user_logged_in (user) { 
        //... 
      },
      and(function products_are_listed_in_the_page (user) { /*...*/ },
        when(function add_the_first_product_to_cart ({ user, page }) { /*...*/ },
          then(function the_product_is_in_the_cart ({ cart, firstProduct }) { /*...*/ })
        )
      )
    )
  )
)
```
result :

```
User purchases products
  Given: user
    And: user_logged_in
      And: products_are_listed_in_the_page
        When: add_the_first_product_to_cart
          ✓ Then: the_product_is_in_the_cart
```

This can be done more Cucumber way
```js
// steps.js
module.exports = {
  'user': (/*...*/) => { /*...*/ },
  'user logged in': (/*...*/) => { /*...*/ },
  'products are listed in the page': (/*...*/) => { /*...*/ },
  'add the first product to cart': (/*...*/) => { /*...*/ },
  'the product is in the cart': (/*...*/) => { /*...*/ },
}

//test.js
const _ = require('./steps')
describe('User purchases products',() => {
  given(_['user'],
    and(_['user logged in'],
      and(_['products are listed in the page'],
        when(_['add the first product to cart'],
          then(_['the product is in the cart'])
        )
      )
    )
  )()
})
```

### More usages

You can find out more examples in the library's [test cases](https://github.com/cj-p/mocha-behavior-tree/tree/master/test)
