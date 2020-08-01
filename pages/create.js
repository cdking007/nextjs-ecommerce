import { useState, useEffect } from "react";
import axios from "axios";
import catchErrors from "../utils/catchErrors";

import {
  Form,
  Input,
  TextArea,
  Button,
  Header,
  Icon,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";

import baseUrl from "../utils/baseUrl";

function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.01);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [prevImg, setPrevImg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, showError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!price || !name || !image || !description) {
      return setDisabled(true);
    }
    return setDisabled(false);
  }, [name, price, image, description]);

  const fileHandle = async () => {
    try {
      const form = new FormData();
      form.append("file", image);
      form.append("upload_preset", "reactshop");
      form.append("cloud_name", "dffrzvsnw");
      const response = await axios.post(process.env.CLOUDINARY_URL, form);
      const mediaUrl = response.data.url;
      return mediaUrl;
    } catch (err) {
      showError(true);
      setLoading(false);
      catchErrors(err, (error) => {
        setErrorMessage(error.error.message);
      });
    }
  };

  const hanldeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mediaUrl = await fileHandle();
      if (!mediaUrl) {
        return showError(true);
      }
      await axios.post(`${baseUrl}/api/product`, {
        name,
        price,
        description,
        mediaUrl,
      });
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setPrevImg("");
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError(true);
      catchErrors(error, (errMsg) => {
        return setErrorMessage(errMsg.message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Segment>
        <Header block as="h2">
          <Icon name="add" color="orange" />
          Create New Product
        </Header>
        <Form
          loading={loading}
          success={success}
          error={error}
          onSubmit={hanldeSubmit}
        >
          <Message
            success
            icon="check"
            header="Success!"
            content="Your product has been posted successfully!"
          />
          <Message
            error
            icon="exclamation circle"
            header="Faild!"
            content={errorMessage}
          />
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              name="name"
              placeholder="Name"
              label="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <Form.Field
              control={Input}
              name="price"
              placeholder="Price"
              label="Price"
              step="0.01"
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
            <Form.Field
              control={Input}
              name="thumbnail"
              type="file"
              placeholder="Thumbnail"
              label="Product image"
              content="Choose file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPrevImg(window.URL.createObjectURL(e.target.files[0]));
              }}
            />
          </Form.Group>
          <Image src={prevImg} rounded centered />
          <Form.Field
            control={TextArea}
            name="description"
            placeholder="Description"
            content="description"
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <Form.Field
            control={Button}
            label="Add product"
            color="blue"
            icon="pencil alternate"
            content="Submit"
            type="submit"
            disabled={disabled || loading}
          />
        </Form>
      </Segment>
    </>
  );
}

export default CreateProduct;
