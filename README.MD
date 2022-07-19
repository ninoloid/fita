# FITA BACKEND ENGINEER TEST

---

## Products in this repo

- FITA Shopping Cart

---

## Tech

What tech I use in this project:

- [Visual Studio Code] - awesome code editor
- [node.js] - evented I/O for the backend
- AWS Lambda
- Serverless
- Typescript

---

## How to start

Install the dependencies and devDependencies and start the server.

```sh
npm install
```

Then you must create the mysql database named "myshop", and run init function :

```sh
npm run init:dev
```

After that, you can run this server using command :

```sh
npm run dev
```

---

## Useful Things to Learn Before You Start

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Additional Clean Architecture Article](https://medium.com/free-code-camp/how-to-write-robust-apps-consistently-with-the-clean-architecture-9bdca93e17b)
- [SOLID Principles](https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898)
- [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Domain Driven Hexagon](https://github.com/Sairyss/domain-driven-hexagon)

---

## Available GraphQL Command?

- Query

```
{
  getProducts {
    id
    sku
    name
    price
    quantity
  }
}
```

- Mutation

```
mutation AddToCart{
  addToCart(
    products: [
      {
      	productId: id_of_product,
      	quantity: quantity_of_product
      }
    ]
  ) {
    cartId
    totalPrice
  }
}
```

There are 3 promotion scenarios :

- Each sale of a Macbook Pro comes with a free Raspberry Pi B

```
mutation MacbookProFreeRaspberryPi{
  addToCart(
    products: [
      {
      	productId: "2764e223-597f-4043-ac18-146858ce80f2",
      	quantity: 1
      },
      {
      	productId: "2764e223-597f-4043-ac18-146858ce80f4",
      	quantity: 1
    	}
    ]
  ) {
    cartId
    totalPrice
  }
}
```

- Buy 3 Google Homes for the price of 2

```
mutation BuyThreeGoogleHomeForThePriceOfTwo{
  addToCart(
    products: [
      {
      	productId: "2764e223-597f-4043-ac18-146858ce80f1",
      	quantity: 3
      }
    ]
  ) {
    cartId
    totalPrice
  }
}
```

Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa Speakers

```
mutation BuyThreeAlexaSpeakerGetDiscountTenPercent{
  addToCart(
    products: [
      {
      	productId: "2764e223-597f-4043-ac18-146858ce80f3",
      	quantity: 3
      }
    ]
  ) {
    cartId
    totalPrice
  }
}
```

For the sake of quick development, I hardcoded the promotion logic in the cart use case.
