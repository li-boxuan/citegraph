import { Outlet, Link, useLoaderData } from "react-router-dom";
import React, { useState } from "react";
import { debounce } from "lodash";
import { getHotAuthors } from "../apis/authors";
import logo from "../assets/logo.svg";
import { API_URL } from "../apis/commons";
import { Divider } from "antd";

export async function loader() {
  const authors = await getHotAuthors();
  return { authors };
}

export default function Root() {
  const { authors } = useLoaderData();

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = debounce((event) => {
    const query = event.target.value;
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/search/author/${query}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching search results: ", error);
        setLoading(false);
      });
  }, 500);

  return (
    <>
      <div id="sidebar">
        <Link to="/">
          <img src={logo} id="logo" alt="Logo" />
        </Link>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search authors"
              placeholder="Search author name"
              type="search"
              name="q"
              onChange={handleSearch}
            />
            <div id="search-spinner" aria-hidden hidden={!loading} />
          </form>
        </div>
        <nav>
          {searchResults.length ? (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id}>
                  <Link to={`author/${result.id}`}>{result.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              <li>
                <i>No results</i>
              </li>
            </ul>
          )}
          <Divider />
          <p>
            <b>People are searching</b>
          </p>
          {authors.length ? (
            <ul>
              {authors.map((author) => (
                <li key={author.id}>
                  <Link to={`author/${author.id}`}>{author.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No authors</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
