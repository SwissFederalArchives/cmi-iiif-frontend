import * as React from 'react';
import Alert from '../Alert';
import Login from '../Login';
import Header from '../header/header';
import Footer from '../footer/footer';
import Content1 from './Content1';

export default function Main() {
  return (
    <>
      <Alert />
      <Login />
      <Header />
      <main id="main">
        <Content1 />
      </main>
      <Footer />
    </>
  );
}
