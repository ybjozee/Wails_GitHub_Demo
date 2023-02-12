import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Button, Card, Divider, Form, Input, message, Switch } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { CreateNewGist } from "../../../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";

const CreateGist = () => {
  const { token } = useAuthContext();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { description, files, isPublic } = values;

    const gist = {
      description,
      public: !!isPublic,
      files: files.reduce(
        (accumulator, { filename, content }) =>
          Object.assign(accumulator, {
            [filename]: { content },
          }),
        {}
      ),
    };

    CreateNewGist(gist, token)
      .then((gist) => {
        messageApi.open({
          type: "success",
          content: `Gist ${gist.id} created successfully`,
        });
        navigate("/gists/private");
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error,
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Card title="Create a new Gist">
        <Form
          name="gist"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="description">
            <Input placeholder="Gist description..." />
          </Form.Item>
          <Form.Item
            label="Make gist public"
            valuePropName="checked"
            name="isPublic"
          >
            <Switch />
          </Form.Item>
          <Form.List
            name="files"
            rules={[
              {
                validator: async (_, files) => {
                  if (!files || files.length < 1) {
                    return Promise.reject(
                      new Error("At least 1 file is required to create a Gist")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key}>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area ||
                        prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <div>
                          <Divider />
                          <Form.Item
                            {...field}
                            name={[field.name, "filename"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing filename",
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="Filename including extension..."
                              style={{ width: "90%", marginRight: "5px" }}
                            />
                          </Form.Item>

                          <DeleteTwoTone
                            style={{
                              fontSize: "30px",
                              verticalAlign: "middle",
                            }}
                            twoToneColor="#eb2f96"
                            onClick={() => remove(field.name)}
                          />
                        </div>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "content"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing content",
                        },
                      ]}
                    >
                      <Input.TextArea rows={20} placeholder="Gist content" />
                    </Form.Item>
                  </div>
                ))}
                <Form.Item
                  wrapperCol={{
                    offset: 10,
                  }}
                >
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add file
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            wrapperCol={{
              offset: 10,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default CreateGist;
