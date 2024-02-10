import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;
const app = express();
const essaysDirectory = path.join(__dirname, 'views', 'eassys');

app.use(bodyParser.urlencoded({ extended: true }))

function createEssay() {
    var inc = fs.readdirSync('views/eassys').length + 1;
    var createstream = fs.createWriteStream(`views/eassys/eassy${inc}.ejs`);
    createstream.end();
}

app.use(express.static("public"))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/createEssay", (req, res) => {
    createEssay();
    res.render("addessay.ejs");
})

app.get("/essay", (req, res) => {

    res.render("essay.ejs");
})

app.post("/success", (req, res) => {
    var data = {
        head: req.body["title"],
        content: req.body["content"],
    }

    var inc = fs.readdirSync('views/eassys').length;

    const essayFileName = path.join(__dirname, 'views', 'eassys', `eassy${inc}.ejs`);

    fs.promises.access(essayFileName);

    fs.promises.writeFile(essayFileName, getEjsContent(data), 'utf-8');
    reload();

    res.render("thankspage.ejs")
})

function getEjsContent(data) {
    return `
      <%- include("../partial/header.ejs") %>
  
      <div class="container">
          <h1 class="text center">
              ${data.head}
          </h1>
  
          <p>
              ${data.content}
          </p>
      </div>
  
      <%- include("../partial/footer.ejs") %>
    `;
}

app.listen(port, (req, res) => {
    console.log(`Application is running in ${port}`);
    var a = fs.readdirSync('views/eassys')[0]
    var b = path.join(__dirname, 'views', 'eassys', `${a}`)
    fs.readFile(`${b}`, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data)
      });
})

function reload() {
    var ejsFiles = fs.readdirSync(essaysDirectory).filter(file => file.endsWith('.ejs'));
    ejsFiles.forEach(file => {
        const route = `/eassys/${path.parse(file).name}`;
        app.get(route, (req, res) => {
            res.render(path.join('eassys', path.parse(file).name));
        });
    });
}

var ejsFiles = fs.readdirSync(essaysDirectory).filter(file => file.endsWith('.ejs'));
ejsFiles.forEach(file => {
    const route = `/eassys/${path.parse(file).name}`;
    app.get(route, (req, res) => {
        res.render(path.join('eassys', path.parse(file).name));
    });
});