import * as React from 'react';
import Alert from '../Alert';
import Login from '../Login';
import FederationHeader from '../federation/header';
import FederationFooter from '../federation/footer';
import Content1 from './Content1';

export default function Main() {
  return (
    <>
      <Alert />
      <Login />
      <FederationHeader />
      <main id="main">
        <Content1 />
      </main>
      <FederationFooter />
    </>
  );
}
