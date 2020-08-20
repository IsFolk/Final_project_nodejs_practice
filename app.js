let express = require('express');
let firebase = require('firebase');
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAUfTR_cmYn3fcv9kbH72gvunhFUykNfGk",
    authDomain: "myproject-4deff.firebaseapp.com",
    databaseURL: "https://myproject-4deff.firebaseio.com",
    projectId: "myproject-4deff",
    storageBucket: "myproject-4deff.appspot.com",
    messagingSenderId: "743442785939",
    appId: "1:743442785939:web:134ba7062c459322fecf66",
    measurementId: "G-T3891TSH0L"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');  
app.get('/', async (req, res) => {  
    //let data = await db.collection('classA').get();
    let userArr = ["自己名稱：/Sarah\n",
                    "Firebase測試：/firebase-test\n",
                    "後端控制：/classA_backend\n",
                    "前端控制：/classA_frontend\n",
                    "輸入變數姓名：/who/name\n",
                    "刪除一筆資料：/API/deleteMember?id=欲輸入id",
                    "新增一筆資料：/API/addMember?name=欲輸入姓名&gender=欲輸入性別&age=欲輸入性別"];
    // data.forEach((doc) => {
    //     console.log(doc.data().name)
    //     userArr.push(doc.data().name);
    // })
    res.render('default', {  
        title: '可用指令',  
        // users: ['Fisheep', 'Fiona', 'Alice', 'Bob']
        users: userArr
    });  
});

app.get("/Sarah", (req, res) => {
    res.send("<h1>Sarah</h1>")
})

app.get("/firebase-test", async (req, res) => {
    let html = '';
    let data = await db.collection('classA').get();
    data.forEach(doc => {
        console.log(doc.data());
        html += `<div>${doc.id}: name = ${doc.data().name} age = ${doc.data().age}</div>`;
    });
    res.send(html)
})

app.get("/classA_backend", async (req, res) => {
    let data = await db.collection('classA').get();
    userArr = []
    data.forEach((doc) => {
        userArr.push({
            id: doc.id,
            name: doc.data().name,
            age: doc.data().age,
            gender: doc.data().gender
        })
    })
    res.render('classA', {
        users: userArr
    })
})

app.get("/classA_frontend", (req, res) => {
    let options = {
        root:  __dirname+"/public",
        dotfiles: 'ignore'
    }
    //console.log(__dirname+"/public");
    res.sendFile("/classA.html", options);
})

app.get('/who/:name', (req, res) => {  
    var name = req.params.name;  
    res.send(`This is ${name}`);  
});

app.get('/API/deleteMember', (req, res) => {
    db.collection('classA').doc(req.query.id).delete();
    console.log(req.query.id);
    res.send(`delete Member id = ${req.query.id}!`)
})

app.get('/API/addMember', (req, res) => {
    db.collection('classA').add({
        name: req.query.name,
        gender: req.query.gender,
        age: req.query.age
    });
    console.log("Add member !!");
    res.send("Add member success!");
})


app.get('*', (req, res) => {  
    res.send('No Content');  
});

let port = process.env.PORT || 3000

app.listen(port, () => {  
    console.log('Listening on port 3000');  
}); 