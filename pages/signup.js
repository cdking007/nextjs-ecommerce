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
import catchError from "../utils/catchErrors";
import { handleLogin } from "../utils/auth";

const INITIAL_DATA = {
  name: "",
  email: "",
  password: "",
};

import axios from "axios";
import baseUrl from "../utils/baseUrl";

function Signup() {
  const [user, setUser] = useState(INITIAL_DATA);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");
    try {
      const url = `${baseUrl}/api/signup`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      setLoading(false);
      setUser(INITIAL_DATA);
      setSuccessMessage("Signup successfully!");
      return handleLogin(response.data.token);
    } catch (err) {
      catchError(err, (error) => {
        setLoading(false);
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
          icon="settings"
          header="Get Started!"
          content="Create New Account!"
          color="teal"
        />
        <Divider />
        <Form
          onSubmit={hanldeSubmit}
          error={Boolean(error)}
          success={Boolean(successMessage)}
          loading={loading}
        >
          <Segment>
            <Message error header="Oops!" content={error} />
            <Message success header="yep!" content={successMessage} />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              label="Name"
              placeholder="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
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
              content="Signup"
              disabled={disabled || loading}
            />
          </Segment>
        </Form>
        <Message attached="bottom" warning>
          <Icon name="help" />
          Existing User?{" "}
          <Link href="/login">
            <a>Login here</a>
          </Link>{" "}
          Instead!
        </Message>
      </Segment>
    </>
  );
}

export default Signup;
