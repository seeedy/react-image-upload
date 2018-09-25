import React, { Component } from "react";
// import axios from "./axios";
import { Switch } from "react-router";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import Favicon from "react-favicon";
import Homepage from "./homepage";
import Contact from "./contact";
import Services from "./services";
import Blog from "./blog";
import Resources from "./resources";
import About from "./about";
import Technical from "./technical";
import Onpage from "./onpage";
import Offpage from "./offpage";
import Audit from "./audit";
import Navigation from "./nav";
import Footer from "./footer";
import { translate, Trans } from "react-i18next";
import i18n from "./i18n";
import WriteArticles from "./blogwrite";

// import SearchBox from "./searchbox";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Favicon url="http://oflisback.github.io/react-favicon/public/img/github.ico" />
        <BrowserRouter>
          <div>
            <Navigation />

            <div>
              <Switch>
                <Route
                  exact
                  path="/:lang"
                  render={() => <Homepage i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/contact"
                  render={() => <Contact i18n={this.props.i18n} />}
                />
                <Route
                  exact
                  path="/:lang/offpage"
                  render={() => <Offpage i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/onpage"
                  render={() => <Onpage i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/en/postarticle"
                  render={() => <WriteArticles i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/audit"
                  render={() => <Audit i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/technical"
                  render={() => <Technical i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/blog"
                  render={() => <Blog i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/resources"
                  render={() => <Resources i18n={this.props.i18n} />}
                />

                <Route
                  exact
                  path="/:lang/about"
                  render={() => <About i18n={this.props.i18n} />}
                />

                <Redirect to="/en/" />
              </Switch>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
