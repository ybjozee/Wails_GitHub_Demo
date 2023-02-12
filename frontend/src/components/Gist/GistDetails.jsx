import { Carousel, Col, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "prismjs/themes/prism-okaidia.min.css";
import Prism from "prismjs";
import { GetGistContent } from "../../../wailsjs/go/main/App";

const GistDetails = ({ gist }) => {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Prism.highlightAll();
  }, [snippets]);

  useEffect(() => {
    const getSnippets = async () => {
      setIsLoading(true);
      const snippets = await Promise.all(
        Object.values(gist.files).map(async (file) => {
          const fileContent = await GetGistContent(file.raw_url, "");
          return {
            language: file.language?.toLowerCase() || "text",
            content: fileContent,
          };
        })
      );
      setSnippets(snippets);
      setIsLoading(false);
    };
    getSnippets();
  }, [gist]);

  return (
    <Spin tip="Loading" spinning={isLoading}>
      <Row justify="center">
        <Col>
          {gist.description && (
            <Typography.Text strong>{gist.description}</Typography.Text>
          )}
        </Col>
      </Row>
      <div>
        <Carousel
          autoplay
          style={{ backgroundColor: "#272822", height: "100%" }}
        >
          {snippets.map((snippet, index) => (
            <pre key={index}>
              <code className={`language-${snippet.language}"`}>
                {snippet.content}
              </code>
            </pre>
          ))}
        </Carousel>
      </div>
    </Spin>
  );
};

export default GistDetails;
