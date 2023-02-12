package main

import (
	"context"
	"encoding/json"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type APIResponse []interface{}

type Gist struct {
	Description string `json:"description"` 
	Public bool `json:"public"` 
	Files interface{} `json:"files"`
}

const BASE_URL = "https://api.github.com"
var githubResponse APIResponse

func (a *App) GetPublicRepositories() (APIResponse, error) {

	url := fmt.Sprintf("%s/repositories", BASE_URL)
	response, err := MakeGetRequest(url, "")

	if err != nil {
		return nil, err
	}
	
	json.Unmarshal(response, &githubResponse)

	return githubResponse, nil
}

func (a *App) GetPublicGists() (APIResponse, error) {

	url := fmt.Sprintf("%s/gists/public", BASE_URL)
	response, err := MakeGetRequest(url, "")

	if err != nil {
		return nil, err
	}
	
	json.Unmarshal(response, &githubResponse)

	return githubResponse, nil
}

func (a *App) GetRepositoriesForAuthenticatedUser(token string) (APIResponse, error) {
	
	url := fmt.Sprintf("%s/user/repos?type=private", BASE_URL)
	response, err := MakeGetRequest(url, token)

	if err != nil {
		return nil, err
	}

	json.Unmarshal(response, &githubResponse)

	return githubResponse, nil
}

func (a *App) GetGistsForAuthenticatedUser(token string) (APIResponse, error) {
	
	url := fmt.Sprintf("%s/gists", BASE_URL)
	response, err := MakeGetRequest(url, token)

	if err != nil {
		return nil, err
	}

	json.Unmarshal(response, &githubResponse)

	return githubResponse, nil
}

func (a *App) GetMoreInformationFromURL(url, token string) (APIResponse, error) {
	
	response, err := MakeGetRequest(url, token)

	if err != nil {
		return nil, err
	}

	json.Unmarshal(response, &githubResponse)

	return githubResponse, nil
}

func (a *App) GetGistContent(url, token string) (string, error) {

	githubResponse, err := MakeGetRequest(url, token)

	if err != nil {
		return "", err
	}

	return string(githubResponse), nil
}

func (a *App) CreateNewGist(gist Gist, token string) (interface{}, error) {

	var githubResponse interface{}

	requestBody, _ := json.Marshal(gist)
	url := fmt.Sprintf("%s/gists", BASE_URL)
	response, err := MakePostRequest(url, token, requestBody)

	if err != nil {
		return nil, err
	}

	json.Unmarshal(response, &githubResponse)
	
	return githubResponse, nil
}