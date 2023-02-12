import { useEffect, useState } from "react";
import GistDetails from "./GistDetails";
import { GetPublicGists } from "../../../wailsjs/go/main/App";
import MasterDetail from "../MasterDetail";
import { message } from "antd";

const PublicGists = () => {
  const [gists, setGists] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getGists = async () => {
      GetPublicGists()
        .then((gists) => {
          setGists(gists);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: error,
          });
        });
    };
    getGists();
  }, []);

  const title = "Public Gists";
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

export default PublicGists;
