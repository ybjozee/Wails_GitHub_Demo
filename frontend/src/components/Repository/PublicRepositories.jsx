import { useEffect, useState } from "react";
import { GetPublicRepositories } from "../../../wailsjs/go/main/App";
import RepositoryDetails from "./RepositoryDetails";
import MasterDetail from "../MasterDetail";
import { message } from "antd";

const PublicRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getRepositories = async () => {
      GetPublicRepositories()
        .then((repositories) => {
          console.log(repositories);
          setRepositories(repositories);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: error,
          });
        });
    };
    getRepositories();
  }, []);

  const title = "Public Repositories";
  const getItemDescription = (repository) => repository.name;
  const detailLayout = (repository) => (
    <RepositoryDetails repository={repository} />
  );

  return (
    <>
      {contextHolder}
      <MasterDetail
        title={title}
        items={repositories}
        getItemDescription={getItemDescription}
        detailLayout={detailLayout}
      />
    </>
  );
};

export default PublicRepositories;
