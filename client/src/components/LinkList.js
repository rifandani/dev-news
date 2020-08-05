import React from 'react';
import { useQuery, gql } from '@apollo/client';
// components
import Link from './Link';
import { LINKS_PER_PAGE } from './constants';

export const FEED_QUERY = gql`
  query FeedQuery($skip: Int!, $take: Int!) {
    feed(skip: $skip, take: $take, orderBy: { createdAt: desc }) {
      count
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

const LinkList = (props) => {
  const _getQueryVariables = () => {
    const isNewPage = props.location.pathname.includes('new');
    const page = parseInt(props.match.params.page, 10);
    // variable skip & take
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const take = isNewPage ? LINKS_PER_PAGE : 10;
    return { skip, take };
  };

  const _getLinksToRender = (data) => {
    // kalo URL nya /new/:page
    const isNewPage = props.location.pathname.includes('new');
    if (isNewPage) return data.feed.links;
    // kalo URL nya /top
    const rankedLinks = [...data.feed.links];
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length); // sort descending (b-a)
    return rankedLinks;
  };

  const _nextPage = (data) => {
    const page = parseInt(props.match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      props.history.push(`/new/${nextPage}`);
    }
  };

  const _previousPage = () => {
    const page = parseInt(props.match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      props.history.push(`/new/${previousPage}`);
    }
  };

  // useQuery
  const { loading, error, data } = useQuery(FEED_QUERY, {
    pollInterval: 5000,
    variables: _getQueryVariables(),
  });
  if (loading)
    return (
      <h4 className="flex flex-column mw7 center bl bw3 pl3 mb2 mt2 b--mid-gray">
        Fetching Data...
      </h4>
    );
  if (error)
    return (
      <h4 className="flex flex-column mw7 center bl bw3 pl3 mb2 mt2 b--mid-gray">
        Error: {error.message}{' '}
      </h4>
    );

  // get URL params
  const linksToRender = _getLinksToRender(data); // /top atau /new/:page
  const isNewPage = props.location.pathname.includes('new');
  const pageIndex = props.match.params.page
    ? (props.match.params.page - 1) * LINKS_PER_PAGE
    : 0;

  return (
    <div className="flex flex-column mw7 center bl bw3 pl3 mb2 mt2 b--mid-gray">
      {(linksToRender || []).map((link, index) => (
        <Link key={link.id} link={link} index={index + pageIndex} />
      ))}

      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div
            className="pointer mr2 hover-bg-light-pink br-pill pa1"
            onClick={_previousPage}
          >
            Previous
          </div>
          <div
            className="pointer hover-bg-light-green br-pill pa1"
            onClick={() => _nextPage(data)}
          >
            Next
          </div>
        </div>
      )}

      {/* <button onClick={() => refetch()}>Refetch</button> */}
    </div>
  );
};

export default LinkList;
