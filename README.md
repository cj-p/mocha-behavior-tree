# mocha-behavior-tree

Hierarchical step definition for Mocha

Easily defining multiple next test steps from the current state with a tree structure hierarchically for reducing duplication of test code and performing tests in a natural sequence of actions.

## Installation

~~`npm i -D mocha-behavior-tree`~~ (not published yet)

## Basic Example

Test below cases...

- user login - list products - add the first product to cart
- user login - list products - puchase the first products
- user login - list products - select all products on the page - add selected products to cart
- user login - list products - select all products on the page - puchase selected products

like this.
 
```js
const { step } = require('mocha-behavior-tree')

describe('User', 
  step('user login', () => { ... },
    step('list products', () => { ... },
      step('add the first product to cart', () => { ... }),
      step('puchase the first products', () => { ... }),
      step('select all products on the page', () => { ... },
        step('add selected products to cart', () => { ... }),
        step('puchase selected products', () => { ... }),
      ),
    )
  )
)
```

## Given, When, Then

`mocha-behavior-tree` offers `given`,`when`,`then`,`and` methods, which are proxies for `step`, just adding BDD style keywords as prefix to the step name.

```js
const { given, when, then } = require('mocha-behavior-tree')

describe('User purchases products', 
  given('User login', () => { ... },
    and('List products', () => { ... },
      when('Add the first product to cart', () => { ... },
        then('The product is in the cart', () => { ... })
      ),
      when('Puchase the first products', () => { ... },
        then('An order for the product is created', () => { ... })
      ),
      when('Select all products on the page', () => { ... },
        then('all products are selected', () => { ... }),
        and('Add selected products to cart', () => { ... },
            then('The products are in the cart', () => { ... })
        ),
        and('Puchase selected products', () => { ... },
            then('Orders for the products are created', () => { ... })
        ),
      ),
    )
  )
)
```

result :
```
User purchases products
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

## Passing values to next Step

Each steps can return any values to pass to the next steps function's argument.

```js
describe('test value passing',
  step('pass 1', () => 1,
    step('passed value is 1', number => expect(number).to.equals(1))
  )
)
```

Multiple values can be passed with object key-values

```js
describe('test multiple value passing',
  step('pass 1, 2', () => ({
      a:1,
      b:2
    }),
    step('passed value is 1, 2', ({a, b}) => {
      expect(a).to.equals(1)
      expect(b).to.equals(2)
    })
  )
)
```

Applied to above example

```js
describe('User purchases products',
  given('User', () => new User('testId'),
    and('user logged in', user => {
        user.login()
        // returning nothing, argument will be bypassed.
      },
      and('products are listed in the page', user => ({
          user,
          page: getProductsPage({ page: 1, size: 20 })
        }),
        when('Add the first product to cart', ({ user, page }) => {
            const firstProduct = page.content[0]
            user.cart.add(firstProduct)

            // pass only values that will be needed for next step
            return {
              cart: user.cart,
              firstProduct
            }
          },
          then('The product is in the cart', ({ cart, firstProduct }) => {
            expect(cart.has(firstProduct)).to.be.true
            expect(cart.size()).to.be.equals(1)
          })
        )
      )
    )
  )
)
```

## Async testing

Looking above example code, `getProductsPage` could be asyncronous function.

```js
when('products are listed in the page', () => { 
    // returns promise
    return getProductsPage({ page: 1, size: 20 })
      .then(result => ({
        page: result
      })
  },
  then('Add the first product to cart', ({ page }) => {
    ...
  })
)
```

or 

```js
when('products are listed in the page', async () => ({ 
    // async/await
    page : await getProductsPage({ page: 1, size: 20 }) 
  }),
  then('Add the first product to cart', ({ page }) => {
    ...
  })
)
```

or just

```js
when('products are listed in the page', 
  () => getProductsPage({ page: 1, size: 20 }), //also returns promise
  then('Add the first product to cart', page => {
    ...
  })
)
```

## Use function name as step name

Step name can be omitted. then function name will be used to step name

```js
describe('User purchases products',
  given(function user () { ... },
    and(function user_logged_in (user) { ... },
      and(function products_are_listed_in_the_page (user) { ... },
        when(function add_the_first_product_to_cart ({ user, page }) { ... },
          then(function the_product_is_in_the_cart ({ cart, firstProduct }) { ... })
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
  'user': (...) => { ... },
  'user logged in': (...) => { ... },
  'products are listed in the page': (...) => { ... },
  'add the first product to cart': (...) => { ... },
  'the product is in the cart': (...) => { ... },
}

//test.js
const _ = require('./steps')
describe('User purchases products11',() => {
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

## More usages

you can find out more examples in the library's [test cases](https://github.com/neocjmix/mocha-behavior-tree/tree/master/test)
