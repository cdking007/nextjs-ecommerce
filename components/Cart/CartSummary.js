import StripeCheckout from "react-stripe-checkout";
import { Segment, Button, Divider } from "semantic-ui-react";
import { useState, useEffect } from "react";
import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ products, handleCartCheckout, success }) {
  const [isCartEmpty, setCartEmpty] = useState(false);
  const [total, setTotal] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setTotal(cartTotal);
    setStripeAmount(stripeTotal);
    if (products.length === 0) {
      setCartEmpty(true);
    } else {
      setCartEmpty(false);
    }
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub Total: </strong> ${total}
        <StripeCheckout
          name="react reserver"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          token={handleCartCheckout}
          triggerEvent="onClick"
          stripeKey={process.env.STRIPE_PUBLIC_KEY}
        >
          <Button
            icon="cart"
            color="teal"
            floated="right"
            content="Checkout"
            disabled={isCartEmpty || success}
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
