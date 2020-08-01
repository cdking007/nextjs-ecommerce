import cookies from "js-cookie";
import Router from "next/router";

export function handleLogin(token) {
  cookies.set("token", token);
  Router.push("/account");
}

export function handleRedirect(ctx, location) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

export function handleLogout() {
  cookies.remove("token");
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
}
