import React from 'react';

interface IProps {
  status: number;
}

export const ErrorPage = ({ status }: IProps) => (
  <div>
    <span>Sorry, something went wrong ({status})</span>
  </div>
);

const makeErrorPage = (status: number) => () => (
  <ErrorPage status={status} />
);

export default makeErrorPage;
