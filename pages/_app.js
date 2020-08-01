import App from "next/app";
import Layout from "../components/_App/Layout";
import Router from "next/router";
import NProgress from "nprogress";
import { parseCookies, destroyCookie } from "nookies";
import axios from "axios";

import { handleRedirect } from "../utils/auth";
import baseUrl from "../utils/baseUrl";

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const isProtectedRoute =
        ctx.pathname === "/account" || ctx.pathname === "/create";
      if (isProtectedRoute) {
        return handleRedirect(ctx, "/login");
      }
    } else {
      try {
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        const response = await axios.get(url, payload);
        const user = response.data;
        pageProps.user = user;

        const isAdmin = user.role === "admin";
        const isRoot = user.role === "root";

        const isNotPermited =
          !(isRoot || isAdmin) && ctx.pathname === "/create";

        if (isNotPermited) {
          handleRedirect(ctx, "/");
        }
      } catch (error) {
        console.log("Error!", error);
        destroyCookie(ctx, "token");
        handleRedirect(ctx, "/login");
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener("storage", this.syncLogout);
  }
  syncLogout = (e) => {
    if (e.key === "logout") {
      Router.push("/login");
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
