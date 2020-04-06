# mocha-behavior-tree

Hierarchical step definition for Mocha

[![NPM](http://img.shields.io/npm/v/mocha-behavior-tree.svg?style=flat-square)](https://npmjs.org/package/mocha-behavior-tree)
[![License](http://img.shields.io/npm/l/mocha-behavior-tree.svg?style=flat-square)](https://github.com/cj-p/mocha-behavior-tree)

Easily defining multiple next steps to test from the current state with a tree structure hierarchically.
This is useful for performing tests in a natural sequence of actions and reducing duplication of test code.

## Install
```sh
npm i -D mocha mocha-behavior-tree
```

## Usage

```js
const { step } = require('mocha-behavior-tree')

describe('test',                                   //Mocha's describe
  step('root step', () => val1,                      //root : passing value to next step
    step('step 1', val1 => { },                      //depth1 : bypass the value when return nothing
      step('step 1.1', val1 => { /* assertion */ }),   //depth2
      step('step 1.2', async val1 => await val2,       //depth2 : async step
        step('step 1.2.1', val2 => { /* assertion */ }), //depth3
        ...
      ),       
      ...
    )
  )    
)
```

### Scenario, Given, When, Then

`scenario` is proxy for `describe`, and `given`,`when`,`then`,`and` are proxies for `step`, just adding BDD style keywords as prefix to the step name.

Below test case

```js
const assert = require('assert')
const { scenario, given, and, then, when } = require('mocha-behavior-tree')

scenario('User purchases products',
  given('User login',                         () => console.log('1. User login'),
    and('List products',                        () => console.log('2. List products'),
      when('Add the first product to cart',       () => console.log('3. Add the first product to cart'),
        then('The product is in the cart',          () => assert(true))
      ),
      when('Puchase the first products',          () => console.log('3. Puchase the first products'),
        then('An order for the product is created', () => assert(true))
      ),
      when('Select all products on the page',     () => console.log('3. Select all products on the page'),
        then('all products are selected',           () => assert(true)),
        and('Add selected products to cart',        () => console.log('4. Add selected products to cart'),
          then('The products are in the cart',        () => assert(true))
        ),
        and('Puchase selected products',            () => console.log('4. Puchase selected products'),
          then('Orders for the products are created', () => assert(true))
        ),
      ),
    )
  )
)

```

is executed as follows:

```yaml
// running each step route of the trees from the root to the leaf

  Scenario: User purchases products
    Given: User login
      And: List products
        When: Add the first product to cart
          1. User login
          2. List products
          3. Add the first product to cart
          ✓ Then: The product is in the cart
          
        When: Puchase the first products
          1. User login
          2. List products
          3. Puchase the first products
          ✓ Then: An order for the product is created
          
        When: Select all products on the page
          1. User login
          2. List products
          3. Select all products on the page
          ✓ Then: all products are selected
          
          And: Add selected products to cart
            1. User login
            2. List products
            3. Select all products on the page
            4. Add selected products to cart
            ✓ Then: The products are in the cart
            
          And: Puchase selected products
            1. User login
            2. List products
            3. Select all products on the page
            4. Puchase selected products
            ✓ Then: Orders for the products are created

  5 passing 
```

For integration with other test codes (or some IDE plugins), you can also do this:

```js
describe('Shop tests', () => {
  describe('User', () => {
    // Note that the scenario is called 'inside' the callback function, 
    // not passed to describe as a callback function.
    scenario('User purchases products', 
      given('User login', () => { /*...*/ },
        /*...*/
      )
    )
  })
})
```

### Passing values to the next Step

Multiple values can be passed to next step within object key-values

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

### Async testing

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

```js
when('products are listed in the page', 
  async () => ({ page : await getProductsPage({ page: 1, size: 20 }) }), // async/await
  then('Add the first product to cart', 
    ({ page }) => {
      // got resolved value here
    })
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

```yaml
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
  'user': () => { ... },
  'user logged in': () => { ... },
  'products are listed in the page': () => { ... },
  'add the first product to cart': () => { ... },
  'the product is in the cart': () => { ... },
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
