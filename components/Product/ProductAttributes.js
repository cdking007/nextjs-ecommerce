import { Header, Button, Modal } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { useRouter } from "next/router";

function ProductAttributes({ description, _id, user }) {
  const router = useRouter();

  const isAdmin = user && user.role === "admin";
  const isRoot = user && user.role === "root";
  const isAdminOrRoot = isAdmin || isRoot;

  const [showModel, setShowModel] = useState(false);

  const handleDelete = async () => {
    const url = `${baseUrl}/api/product`;
    const { data } = await axios.delete(url, { params: { _id } });

    if (data.status === "fail") {
      return console.log(data.message);
    }
    return router.push("/");
  };
  return (
    <>
      <Header as="h3">About this product</Header>
      <p>{description}</p>
      {isAdminOrRoot && (
        <>
          <Button
            icon="trash alternate outline"
            color="red"
            content="Delete Product"
            onClick={() => setShowModel(true)}
          />
          <Modal
            open={showModel}
            dimmer="blurring"
            onClose={() => setShowModel(false)}
            size="small"
            closeIcon
          >
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              Are you sure you want to Delete this product?
            </Modal.Content>
            <Modal.Actions>
              <Button content="Cancel" onClick={() => setShowModel(false)} />
              <Button
                icon="trash"
                labelPosition="right"
                negative
                content="Delete"
                onClick={handleDelete}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductAttributes;
