package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func makeRequest(requestType, url, token string, payload []byte ) ([]byte, error){
	client := &http.Client{}

	var request *http.Request

	if payload != nil {
		requestBody := bytes.NewReader(payload)
		request, _ = http.NewRequest(requestType, url, requestBody)
	}else {
		request, _ = http.NewRequest(requestType, url, nil)
	}

	request.Header.Set("Accept", "application/vnd.github+json")

	if token != "" {
		request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	}

	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}

	body, _ := io.ReadAll(response.Body)

	return body, nil
}

func MakeGetRequest(url string, token string) ([]byte, error) {
	return makeRequest("GET", url, token, nil)
}

func MakePostRequest(url, token string, payload []byte) ([]byte, error){
	return makeRequest("POST", url, token, payload)
}
