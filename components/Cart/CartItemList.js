import {
  Segment,
  Header,
  Button,
  Icon,
  Item,
  Message,
} from "semantic-ui-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function CartItemList({ user, products, handleRemoveFromCart, success }) {
  const router = useRouter();

  function mapCartProductsToItems(products) {
    return products.map((p) => {
      return {
        childKey: p.product._id,
        header: (
          <Item.Header
            as="a"
            onClick={() => router.push(`/product?_id=${p.product._id}`)}
          >
            {p.product.name}
          </Item.Header>
        ),
        image: p.product.mediaUrl,
        meta: `${p.quntity} x ${p.product.price}`,
        fluid: "true",
        extra: (
          <Button
            basic
            icon="remove"
            floated="right"
            onClick={() => handleRemoveFromCart(p.product._id)}
          />
        ),
      };
    });
  }

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted!"
        icon="star outline"
      />
    );
  }

  if (products.length === 0) {
    return (
      <Segment inverted color="teal" textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No Products In Your Cart. Add Some!
        </Header>
        <div>
          {user ? (
            <Button color="orange" onClick={() => router.push("/")}>
              View Products
            </Button>
          ) : (
            <Button color="blue" onClick={() => router.push("/login")}>
              Login To View Product
            </Button>
          )}
        </div>
      </Segment>
    );
  }
  return <Item.Group items={mapCartProductsToItems(products)} divided />;
}

export default CartItemList;
