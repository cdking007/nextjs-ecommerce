import { useEffect } from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";

function Home(props) {
  return (
    <>
      <ProductList products={props.products} />
    </>
  );
}

Home.getInitialProps = async (ctx) => {
  const url = `${baseUrl}/api/products`;
  const response = await axios.get(url);
  return {
    products: response.data,
  };
};
export default Home;
