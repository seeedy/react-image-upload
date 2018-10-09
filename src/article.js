import React, { Component } from "react";
import ReactDOM from "react";
import App from "./App";
import axios from "./axios";
import BlogList from "./BlogList";

import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import { translate, Trans } from "react-i18next";
// import i18n from "./i18n";
import { Helmet } from "react-helmet";
import NoMatch from "./NoMatch";

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
    this.createMarkup = this.createMarkup.bind(this);
  }

  createMarkup() {
    return { __html: this.state.article };
  }
  componentDidMount() {
    let BE = this.props.page.slice(9);
    console.log("BE", BE);
    axios.get(`/getarticleurl/${BE}`).then(res => {
      if (res.data.rows.length == 0) {
        this.setState({
          error: true
        });
      } else {
        let {
          id,
          title,
          author,
          article,
          imageurl,
          status,
          dat
        } = res.data.rows[0];

        dat = dat.slice(0, 10);

        this.setState({
          id,
          title,
          author,
          article,
          imageurl,
          status,
          dat
        });
      }
    });
    happyfun();
  }

  render() {
    if (this.state.error) {
      return <NoMatch />;
    }

    console.log(this.state);
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.state.title + " | SEO Berlino Blog"}</title>
        </Helmet>
        <div id="three-js-item" />

        <div className="listArticlesBlog">
          <BlogList lang={this.props.lang} pageChange={this.changePage} />
        </div>
        <div className="blogArticleWindow">
          <div className="articleTitle">{this.state.title}</div>
          <div className="articleAuthor">{"Author:  " + this.state.author}</div>
          <div className="articleDate">
            {"Date published:  " + this.state.dat}
          </div>
          <div className="articleID">{"#" + this.state.id}</div>
          <img src={this.state.imageurl} className="articlePic" />
          <div
            className="articleArticle"
            dangerouslySetInnerHTML={this.createMarkup()}
          />
          <footer className="blognote">
            Blog built using Postgres SQL, background with 3js.{" "}
          </footer>
        </div>
      </div>
    );
  }
}

export default Article;
