# GitHub Search
This is a small POC application for a proxy to GitHub's search API and cache the response for display on the frontend. Tests are lacking at the moment, and I would not consider this 'production-ready' code.

## Starting the application
1. Install dependencies using `npm install` in the main project directory. This will install dependencies for both the backend and frontend
1. Run `npm start` in the main project directory to start the frontend and backend. You'll be able to access the backend at `localhost:8080` and the frontend at `localhost:3000`.

## Backend
The backend is a simple Express.js server that proxies requests to GitHub's search API. It returns only relevant information that the frontend requires. In addition, requests are cached to save API calls. At this time there is no cache eviction strategy implemented.

A language filter may be provided by including a URL parameter of `language` along with a URL encoded language to search for.

In addition a `sort` may be provided - `stars` or `score` are the supported options by GitHub.

Only the first page of results is supported by the backend at this time.

## Frontend
The frontend is very simple and includes a basic search box that directs the user to a results page which shows results returned by the backend - a title and a short description. Clicking a repository provides the number of stars, owner, language, description, and repo URL. The search results allows the filtering and sorting supported by the backend. Future improvements would include a more detailed and better-designed repository details page, more filtering and sorting options, and a collapsible sidebar.