import React from "react";
import App, { Container } from "next/app";

class MyApp extends App {
  static async getInitialProps() {
    return { pageProps: {} };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
