equire("dotenv").config();
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.API_SERVER
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const listId = process.env.LIST_ID;

    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }

    const run = async () => {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: user.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: user.firstName,
                    LNAME: user.lastName
                }
            });

            console.log(`Successfully added subscriber ${user.email} to list ${listId}`);
            res.sendFile(__dirname + "/success.html");

        } catch (error) {
            console.log(`Failed to add subscriber ${user.email} to list ${listId}: ${error}`);
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();

})

app.get("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running at port 3000");
})
