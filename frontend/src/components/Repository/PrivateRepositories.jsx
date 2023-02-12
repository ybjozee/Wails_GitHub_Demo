import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { GetRepositoriesForAuthenticatedUser } from "../../../wailsjs/go/main/App";
import RepositoryDetails from "./RepositoryDetails";
import MasterDetail from "../MasterDetail";
import { message } from "antd";

const PrivateRepositories = () => {
  const { token } = useAuthContext();
  const [repositories, setRepositories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getRepositories = async () => {
      if (token) {
      GetRepositoriesForAuthenticatedUser(token)
        .then((repositories) => {
          setRepositories(repositories);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: error,
          });
        });
      }
    };
    getRepositories();
  }, [token]);

  const title = "Private Repositories";
  const getItemDescription = (repository) => repository.name;
  const detailLayout = (repository) => (
    <RepositoryDetails repository={repository} token={token}/>
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

export default PrivateRepositories;
