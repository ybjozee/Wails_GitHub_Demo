import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { GetGistsForAuthenticatedUser } from "../../../wailsjs/go/main/App";
import MasterDetail from "../MasterDetail";
import GistDetails from "./GistDetails";
import { message } from "antd";

const PrivateGists = () => {
  const [gists, setGists] = useState([]);
  const { token } = useAuthContext();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getGists = async () => {
      if (token) {
        GetGistsForAuthenticatedUser(token)
          .then((gists) => {
            setGists(gists);
          })
          .catch((error) => {
            messageApi.open({
              type: "error",
              content: error,
            });
          });
      }
    };
    getGists();
  }, [token]);

  const title = "Private Gists";
  const getItemDescription = (gist) =>
    gist.description || "No description provided";
  const detailLayout = (gist) => <GistDetails gist={gist} />;

  return (
    <>
      {contextHolder}
      <MasterDetail
        title={title}
        items={gists}
        getItemDescription={getItemDescription}
        detailLayout={detailLayout}
      />
    </>
  );
};

export default PrivateGists;
