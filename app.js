const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this for JSON handling
app.use(express.static('public'));
app.set('view engine', 'ejs');

const usersFilePath = path.join(__dirname, 'users.txt');

let posts = [
    { id: 1, title: "TechCrunch", content: "Main topics: technology and startup news Created on: WordPress VIP,TechCrunch is a blog that provides technology and startup news, from the latest developments in Silicon Valley to venture capital funding.The blog’s target audience is technology and business enthusiasts, especially startup founders and investors worldwide.What Can We Learn From This Blog.The TechCrunch website’s clean layout prioritizes text readability with its simple white background and black text.Headlines of the most recent articles are shown neatly on the homepage and accompanied by snippets from the blog posts and relevant pictures to add a splash of color.The TechCrunch website also provides a helpful sidebar on the left side of the screen for easy navigation." },
    { id: 2, title: "Engadget", content: "Main topics: technology, gadgets, consumer electronics Created on: proprietary AOL CMS Launched by Peter Rojas, Engadget is a technology blog providing reviews of gadgets and consumer electronics as well as the latest news in the tech world. It also showcases the best tech deals, helping people make the best gadget purchases according to their needs. What Can We Learn From This Blog The blog’s simple black-and-white theme gives it a sleek look fitting for a technology blog. Upon accessing the website, visitors’ eyes are immediately drawn to the collage of photos and headlines of their most recent and popular articles. Further down the page, more article headlines are sorted by the most recent to the oldest and accompanied by a picture and sentence summarizing the article’s content. This lets visitors know that the blog is regularly updated with a variety of content." },
    { id: 3, title: "Girlboss", content: "Main topics: women, business, personal development. Created on: Prismic. Created by businesswoman Sophia Amoruso, Girlboss is a community-driven website that aims to help women redefine their success. Its primary target audience is ambitious women who want to advice rapidly in their careers, build networks, and self-improve. The Girlboss lifestyle blog provides various blog topics such as beauty, wellness, work, and finance. What Can We Learn From This Blog The Girlboss team makes sure the pictures accompanying their articles follow the same color scheme. All the pictures feature subjects set in front of a colorful background mix of soft, pastel colors. This way, all the photos come together as a visually-attractive and cohesive unit" }
];

app.use((req, res, next) => {
    res.locals.posts = posts;
    next();
});

const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');

app.use('/', indexRoutes);
app.use('/', postRoutes);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "samiya8793@gmail.com", // Your Gmail
        pass: "leyw yesd pkcr aqzc"  // Your App Password (not your actual Gmail password)
    }
});

// Signup Route (Using JSON Response)
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (!err && data.includes(email)) {
            return res.json({ success: false, message: "User already exists. Please log in." });
        }

        const newUser = `${name},${email},${password}\n`;
        fs.appendFile(usersFilePath, newUser, (err) => {
            if (err) return res.json({ success: false, message: "Error saving user." });

            const mailOptions = {
                from: "samiya8793@gmail.com",
                to: email,
                subject: "Welcome to Content Hub!",
                text: `Hi ${name},\n\nThank you for signing up for Content Hub! We're excited to have you on board.\n\nBest Regards,\nContent Hub Team`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.json({ success: false, message: "Signup successful, but email could not be sent." });
                }
                return res.json({ success: true, message: "Signup successful! Check your email." });
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ success: false, message: "Error reading user data." });

        const users = data.split("\n").map(user => user.split(","));
        const user = users.find(u => u[1] === email && u[2] === password);

        if (user) {
            // Nodemailer setup
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "samiya8793@gmail.com", // Replace with your email
                    pass: "leyw yesd pkcr aqzc" // Use an app password for security
                }
            });

            const mailOptions = {
                from: "samiya8793@gmail.com",
                to: email,
                subject: "Login Alert - Content Hub",
                text: `Hello ${user[0]},\n\nYou have successfully logged in to Content Hub.\n\nIf this wasn't you, please reset your password immediately.\n\nBest,\nContent Hub Team`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.json({ success: false, message: "Login successful, but email failed to send." });
                } else {
                    console.log("Login email sent: " + info.response);
                    return res.json({ success: true, message: `Welcome, ${user[0]}! Login email sent successfully.` });
                }
            });
        } else {
            return res.json({ success: false, message: "Invalid email or password." });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
