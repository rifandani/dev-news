import React from 'react';
import { gql, useMutation } from '@apollo/client';
// components
import { AUTH_TOKEN } from './constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = ({ link, index }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [voteMutation] = useMutation(VOTE_MUTATION, {
    onCompleted: (data) => alert('Voted successfully'),
    onError: (error) => alert(`${error}, Try Again`),
  });

  return (
    <div className="flex mt2 items-start mb2">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div
            className="ml3 f11 button pointer br-pill hover-bg-light-red "
            onClick={() => {
              voteMutation({
                variables: {
                  linkId: link.id,
                },
              });
            }}
          >
            <span role="img" aria-label="Love">
              💖{' '}
            </span>
          </div>
        )}
      </div>

      <div className="ml2">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="mt1 f6 lh-copy gray">
          {link.votes.length} votes ~ 👨‍💻{' '}
          {link.postedBy ? link.postedBy.name : '👾'}
          {' ⌛ '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
