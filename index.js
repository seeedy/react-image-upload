const express = require("express");
const nodemailer = require("nodemailer");
var i18n = require("i18next");
const i18nFsBackend = require("i18next-node-fs-backend");
const i18nMiddleware = require("i18next-express-middleware");
const fs = require("fs");
const app = express();
const compression = require("compression");
const db = require("./sql/db.js");
const { checkPassword, hashPassword } = require("./Public/hash.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.static("./public"));
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);

var csurf = require("csurf");
app.use(csurf());

app.use(function(req, res, next) {
  res.cookie("mytoken", req.csrfToken());
  next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(express.static("./Public"));
app.use(require("body-parser").json());

function checkSession(req, res, next) {
  if (!req.session.userId) {
    res.redirect("/en");
  } else {
    next();
  }
}

////////////LANGUAGES////////////
//
// i18n
//   .use(i18nFsBackend)
//   .use(i18nMiddleware.LanguageDetector)
//   .init({
//     backend: {
//       loadPath: __dirname + "/src/i18n.js"
//     },
//     fallbackLng: "de",
//     lowerCaseLng: true,
//     preload: ["en", "de"],
//     saveMissing: true
//   });
//
// app.use(
//   i18nMiddleware.handle(i18n, {
//     removeLngFromUrl: false
//   })
// );

////////////END LANGUAGES////////////

app.get("/:lang/editarticle", checkSession, (req, res, next) => {
  next();
});
app.get("/:lang/postarticle", checkSession, (req, res, next) => {
  next();
});
app.get("/:lang/admin", checkSession, (req, res, next) => {
  console.log("REQPARAMS", req.params);
  console.log("REQSESSION", req.session);
  next();
});

app.post("/:lang/postarticle", checkSession, (req, res) => {
  db.postArticle(
    req.body.title,
    req.body.author,
    req.body.article,
    req.body.status,
    req.body.imageurl
  )
    .then(({ rows }) => {
      res.json({
        success: true
      });
    })
    .catch(error => {
      console.log("error in upload server", error);
      res.status(500).json({
        success: false
      });
    });
});

app.post("/:lang/editarticle/:id", checkSession, (req, res) => {
  db.updateArticle(
    req.body.title,
    req.body.author,
    req.body.article,
    req.body.status,
    req.body.imageurl,
    req.params.id
  )
    .then(({ rows }) => {
      res.json({
        success: true
      });
    })
    .catch(error => {
      console.log("error in upload server", error);
      res.status(500).json({
        success: false
      });
    });
});

app.get("/getarticles", (req, res) => {
  db.getArticles().then(function(results) {
    res.json(results);
  });
});

app.get("/get3articles", (req, res) => {
  db.get3Articles().then(function(results) {
    res.json(results);
  });
});

app.get("/getarticle/:id", (req, res) => {
  console.log("REQPARAMS", req.params.id);
  db.getArticle(req.params.id).then(function({ rows }) {
    res.json({ rows });
  });
});
app.post("/:lang/login", (req, res) => {
  let { email, pass } = req.body;
  db.login(email)
    .then(function(result) {
      if (!result) {
        throw new Error();
      } else {
        return checkPassword(pass, result.rows[0].password).then(function(
          doesMatch
        ) {
          if (doesMatch) {
            req.session.userId = result.rows[0].id;
            res.json({
              success: true
            });
          } else {
            throw new Error();
          }
        });
      }
    })
    .catch(function(e) {
      console.log("error while login");
      res.json({
        success: false
      });
    });
});

app.get("/log-out", (req, res) => {
  req.session = null;
  return res.redirect("/en");
});

// app.get("/:lang/blog/:url", (req, res) => {});

//
//
//
//
//
//
//
//
//
//
//
////////////////DO NOT TOUCH/////////////////////////

app.post("/:lang/form", (req, res) => {
  console.log(req.body);

  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = `
        <h3> Contact Details </h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "seoberlino@gmail.com",
        pass: "SeoBerlinoGeraldine88"
      }
    });

    let mailOptions = {
      from: "test@testaccount.com",
      to: "alex.bieth@gmail.com",
      replyTo: " test@testaccount.com",
      subject: "new Message from website",
      text: req.body.message,
      html: htmlEmail
    }; //closemailoptions
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("error sending mail", error);
      }
      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }); //transporter
  });
}); //main

app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
  console.log("I'm listening.");
});
