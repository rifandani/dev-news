import React, { useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
// import { withApollo } from '@apollo/client/react/hoc'; // old API === mungkin bisa pake useApolloClient
// components
import Link from './Link';

const FEED_QUERY = gql`
  query FeedQuery($skip: Int!, $take: Int!, $filter: String!) {
    feed(
      skip: $skip
      take: $take
      filter: $filter
      orderBy: { createdAt: desc }
    ) {
      links {
        id
        description
        url
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = () => {
  const [links, setLinks] = useState(null);
  const [filter, setFilter] = useState('');
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(1);

  const client = useApolloClient(); // This client has a method called query which you can use to send a query manually

  const _executeSearch = async () => {
    const result = await client.query({
      query: FEED_QUERY,
      variables: {
        skip,
        take,
        filter,
      },
    });

    const links = await result.data.feed.links;
    setLinks(links);
  };

  return (
    <>
      <h2 className="flex justify-center">Filter</h2>
      <form
        className="flex mt3 justify-center center"
        onSubmit={(e) => {
          e.preventDefault();
          _executeSearch();
        }}
      >
        <label className=" pa3 w-10 dib">
          Skip:{' '}
          <input
            type="number"
            className="mw-100 pa3 dib"
            value={skip}
            onChange={(e) => setSkip(Math.abs(e.target.value))}
          />
        </label>
        <label className=" pa3 w-10 dib">
          Take:{' '}
          <input
            type="number"
            className="mw-100 pa3 dib"
            value={take}
            onChange={(e) => setTake(Math.abs(e.target.value))}
          />
        </label>

        <input
          type="text"
          className="mb3 mt3 w-40 pa3 mr2 dib"
          placeholder="Search for a specific link"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          type="submit"
          className="w-10 pa3 mr2 hover-bg-gold pointer mt3 mb3 dib"
        >
          Search
        </button>
      </form>

      <h2 className="mt3 flex justify-center">
        <span role="img" aria-label="Result">
          👇{' '}
        </span>
      </h2>

      <div className="flex flex-column mt2 mb2 mw7 center bl bw3 pl3 b--mid-gray">
        {(links || []).map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    </>
  );
};

export default Search;
