import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
// components
// import { LINKS_PER_PAGE } from './constants';
// import { FEED_QUERY } from './LinkList';

const POST_LINK = gql`
  mutation PostLink($description: String!, $url: String!) {
    postLinkAuth(description: $description, url: $url) {
      id
      description
      url
      createdAt
    }
  }
`;

const CreateLink = (props) => {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const [postLink] = useMutation(POST_LINK, {
    onCompleted: (data) => {
      props.history.push('/');
      alert('Link shared successfully');
    },
    onError: (error) => alert(`${error}, Try Again`),
    // update: (cache, { data: { postLinkAuth } }) => {
    //   const skip = 0;
    //   const take = LINKS_PER_PAGE;
    //   // get query dari cache
    //   const data = cache.readQuery({
    //     query: FEED_QUERY,
    //     variables: {
    //       skip,
    //       take,
    //     },
    //   });
    //   // insert elem link baru di awal array
    //   data.feed.links.unshift(postLinkAuth);
    //   // update query
    //   cache.writeQuery({
    //     query: FEED_QUERY,
    //     data,
    //     variables: {
    //       skip,
    //       take,
    //     },
    //   });
    // },
  });

  return (
    <>
      <h2 className="flex justify-center">Share a Link</h2>
      <form
        className="flex mt3 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          // optimistic UI (seharusnya untuk method PUT)
          postLink({
            variables: {
              description,
              url,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              postLinkAuth: {
                __typename: 'Link',
                description,
                url,
              },
            },
          });
        }}
      >
        <input
          required
          type="text"
          className="mb2 fl w-50 pa3 mr2"
          placeholder="A description for the link"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          required
          type="text"
          className="mb2 fl w-50 pa3 mr2"
          placeholder="The URL for the link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="mb2 fl w-10 pa3 mr2 hover-bg-light-green pointer"
        >
          Share
        </button>
      </form>
    </>
  );
};

export default CreateLink;
