import { useState, useEffect } from "react";
import {
  Segment,
  Button,
  Message,
  Form,
  Divider,
  Icon,
} from "semantic-ui-react";
import Link from "next/link";
import axios from "axios";

import catchError from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import { handleLogin } from "../utils/auth";

const INITIAL_DATA = {
  email: "",
  password: "",
};

function Login() {
  const [user, setUser] = useState(INITIAL_DATA);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isUser = Object.values(user).every((el) => Boolean(el));
    if (isUser) {
      return setDisabled(false);
    } else {
      return setDisabled(true);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const hanldeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = `${baseUrl}/api/login`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data.token);
    } catch (err) {
      catchError(err, (error) => {
        setError(error.message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Segment>
        <Message
          attached
          icon="privacy"
          header="Welcome back!"
          content="Login With Email And Password!"
          color="blue"
        />
        <Divider />
        <Form onSubmit={hanldeSubmit} error={Boolean(error)} loading={loading}>
          <Segment>
            <Message error header="Oops!" content={error} />

            <Form.Input
              fluid
              icon="envelope"
              iconPosition="left"
              label="Email"
              placeholder="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            <Button
              icon="signup"
              type="submit"
              color="orange"
              content="Login"
              disabled={disabled || loading}
            />
          </Segment>
        </Form>
        <Message attached="bottom" warning>
          <Icon name="help" />
          New User?{" "}
          <Link href="/signup">
            <a>Signup here</a>
          </Link>{" "}
        </Message>
      </Segment>
    </>
  );
}

export default Login;
