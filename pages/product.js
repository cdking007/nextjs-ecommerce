import Axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttribute from "../components/Product/ProductAttributes";
import baseUrl from "../utils/baseUrl";

function Product({ product, user }) {
  return (
    <>
      <ProductSummary user={user} {...product} />
      <ProductAttribute user={user} {...product} />
    </>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const response = await (
    await Axios.get(`${baseUrl}/api/product`, { params: { _id } })
  ).data;
  return {
    product: response,
  };
};

export default Product;
