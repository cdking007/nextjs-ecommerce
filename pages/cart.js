import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import axios from "axios";
import { useState } from "react";

import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import baseUrl from "../utils/baseUrl";
import cookies from "js-cookie";
import catchErrors from "../utils/catchErrors";

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRemoveFromCart(productId) {
    try {
      const token = cookies.get("token");
      const url = `${baseUrl}/api/cart`;
      const payload = {
        params: { productId },
        headers: { Authorization: token },
      };
      const response = await axios.delete(url, payload);
      console.log(response.data.products);
      setCartProducts(response.data.products);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleCartCheckout(paymentData) {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookies.get("token");
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await axios.post(url, payload, headers);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, (e) => {
        window.alert(e.message);
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Segment>
      <CartItemList
        user={user}
        products={cartProducts}
        handleRemoveFromCart={handleRemoveFromCart}
        success={success}
      />
      <CartSummary
        success={success}
        products={cartProducts}
        handleCartCheckout={handleCartCheckout}
        success={success}
      />
    </Segment>
  );
}

Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  console.log(token);
  if (!token) {
    return { products: [] };
  }
  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  return { products: response.data.cart };
};

export default Cart;
