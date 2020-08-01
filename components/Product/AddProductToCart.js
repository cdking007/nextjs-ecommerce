import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookies from "js-cookie";
import catchErrors from "../../utils/catchErrors";
import catchError from "../../utils/catchErrors";

function AddProductToCart({ user, productId }) {
  const [quntity, setQuntity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = {
        quntity,
        productId,
      };
      const token = cookies.get("token");
      const header = { headers: { Authorization: token } };
      await axios.put(url, payload, header);
      setSuccess(true);
    } catch (err) {
      catchError(err, (error) => {
        window.alert(error.message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        type="number"
        min="1"
        placeholder="quantity"
        value={quntity}
        action={
          user && success
            ? {
                color: "blue",
                content: "Item Added!",
                icon: "plus cart",
                disabled: true,
              }
            : user
            ? {
                color: "orange",
                content: "Add to Cart",
                icon: "plus cart",
                loading,
                disabled: loading,
                onClick: handleAddToCart,
              }
            : {
                color: "blue",
                content: "Signup to Purchase",
                icon: "signup",
                onClick: () => router.push("/signup"),
              }
        }
        onChange={(e) => setQuntity(Number(e.target.value))}
      />
    </>
  );
}

export default AddProductToCart;
