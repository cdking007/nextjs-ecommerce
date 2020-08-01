import { Menu, Image, Icon, Container } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { handleLogout } from "../../utils/auth";
function Header({ user }) {
  const router = useRouter();

  const isActive = (route) => {
    return route === router.pathname;
  };
  return (
    <Menu stackable fluid id="menu" inverted>
      <Container text>
        <Link href="/">
          <Menu.Item header active={isActive("/")}>
            <Image size="mini" src="/logo.svg" style={{ marginRight: "1em" }} />
            ReactShop
          </Menu.Item>
        </Link>
        <Link href="/cart">
          <Menu.Item header active={isActive("/cart")}>
            <Icon name="cart" size="large" />
            Cart
          </Menu.Item>
        </Link>
        {user && (
          <>
            {((user.user && user.user.role === "admin") ||
              (user.user && user.user.role === "root")) && (
              <Link href="/create">
                <Menu.Item header active={isActive("/create")}>
                  <Icon name="add square" size="large" />
                  Create
                </Menu.Item>
              </Link>
            )}
            <Link href="/account">
              <Menu.Item header active={isActive("/account")}>
                <Icon name="user" size="large" />
                Account
              </Menu.Item>
            </Link>

            <Menu.Item
              header
              active={isActive("/logout")}
              onClick={handleLogout}
            >
              <Icon name="sign out" size="large" />
              logout
            </Menu.Item>
          </>
        )}
        {!user && (
          <>
            <Link href="/login">
              <Menu.Item header active={isActive("/login")}>
                <Icon name="sign in" size="large" />
                Login
              </Menu.Item>
            </Link>
            <Link href="/signup">
              <Menu.Item header active={isActive("/signup")}>
                <Icon name="signup" size="large" />
                Signup
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
