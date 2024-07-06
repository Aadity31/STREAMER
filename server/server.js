const express = require("express");
const cors = require("cors");
const { formatDistanceToNow } = require("date-fns");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const dbPool = require("./database");

const port = 4000;

const app = express();
const JWT_SECRET = "your_jwt_secret_key";

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const whitelist = ["http://localhost:3000", "http://192.168.203.1:3000"];
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/adduser", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      username,
      password,
    } = req.body;

    const usernameExistsQuery = `SELECT EXISTS (SELECT 1 FROM users WHERE username = $1);`;
    const usernameExistsResult = await dbPool.query(usernameExistsQuery, [
      username,
    ]);

    const usernameExists = usernameExistsResult.rows[0].exists;
    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    const insertUserQuery = `
      INSERT INTO users (username, email, password_hash, full_name, phone, dob, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING user_id;
    `;

    const values = [
      username,
      email,
      password,
      `${firstName} ${lastName}`,
      phone,
      dob,
      gender,
    ];
    const result = await dbPool.query(insertUserQuery, values);

    const userId = result.rows[0].user_id;

    res.status(201).json({ success: true, userId });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ success: false, error: "Failed to add user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const loginQuery = `SELECT user_id FROM users WHERE username = $1 AND password_hash = $2;`;
    const result = await dbPool.query(loginQuery, [username, password]);

    if (result.rows.length === 1) {
      const { user_id } = result.rows[0];
      const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: "3d" });
      res.cookie("token", token, { httpOnly: true, maxAge: 259200000 });

      res
        .status(200)
        .json({ success: true, message: "Login successful", user_id });
    } else {
      console.warn(`Login failed for username: ${username}`);
      res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, error: "Failed to log in" });
  }
});

app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }
  next();
});

app.get("/", (req, res) => {
  if (req.user) {
    res.send(`Hello, ${req.user.username}!`);
  } else {
    res.send("Hello, gust!");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.send("logout_success");
});

app.get("/username", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.user_id;
    const getUserInfoQuery = `SELECT username, profile_path, full_name, bio FROM users WHERE user_id = $1;`;
    const result = await dbPool.query(getUserInfoQuery, [userId]);

    if (result.rows.length === 1) {
      const { username, profile_path, full_name, bio } = result.rows[0];
      res.json({ username, profile_path, full_name, bio });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

//other user profile
app.get("/otherusername/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    // console.log("Received userId:", userId);

    // Ensure userId is a valid integer
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const getUserInfoQuery = `
      SELECT u.username, 
             u.profile_path, 
             u.full_name, 
             u.bio, 
             COUNT(DISTINCT f.follower_id) AS follower_count,
             COUNT(DISTINCT fo.following_id) AS following_count,
             COUNT(DISTINCT p.post_id) AS post_count
      FROM users u
      LEFT JOIN followers f ON u.user_id = f.user_id
      LEFT JOIN following fo ON u.user_id = fo.user_id
      LEFT JOIN posts p ON u.user_id = p.user_id
      WHERE u.user_id = $1
      GROUP BY u.user_id;
    `;

    const result = await dbPool.query(getUserInfoQuery, [userId]);

    if (result.rows.length === 1) {
      const {
        username,
        profile_path,
        bio,
        follower_count,
        following_count,
        post_count,
      } = result.rows[0];
      res.json({
        username,
        profile_path,
        bio,
        follower_count,
        following_count,
        post_count,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

//search list
app.get("/search", (req, res) => {
  const query = `
SELECT user_id, profile_path, username, full_name 
FROM users
`;

  dbPool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }

    res.json(results.rows);
  });
});

//postdata
app.get("/posts/:user_id", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.user_id;
    const countPostsQuery = `SELECT COUNT(*) AS posts_count FROM posts WHERE user_id = $1;`;
    const result = await dbPool.query(countPostsQuery, [userId]);

    if (result.rows.length === 1) {
      const { posts_count } = result.rows[0];
      res.json({ posts_count });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/followers/:user_id", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.user_id;
    const countFollowersQuery = `SELECT COUNT(*) AS follower_count FROM followers WHERE user_id = $1;`;
    const result = await dbPool.query(countFollowersQuery, [userId]);

    if (result.rows.length === 1) {
      const { follower_count } = result.rows[0];
      res.json({ follower_count });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/following/:user_id", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.user_id;
    const countFollowingQuery = `SELECT COUNT(*) AS following_count FROM following WHERE user_id = $1;`;
    const result = await dbPool.query(countFollowingQuery, [userId]);

    if (result.rows.length === 1) {
      const { following_count } = result.rows[0];
      res.json({ following_count });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/story", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken || !decodedToken.user_id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decodedToken.user_id;
    const query = `
      SELECT users.username, users.profile_path,
             STRING_AGG(story.story_path, ', ') AS story_path
      FROM following
      INNER JOIN story ON following.following_id = story.user_id
      INNER JOIN users ON following.following_id = users.user_id
      WHERE following.user_id = $1
      GROUP BY users.username, users.profile_path;
    `;

    const result = await dbPool.query(query, [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res
        .status(404)
        .json({ error: "No stories found for users whom you are following" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

app.get("/shorts", (req, res) => {
  const query = `
    SELECT shorts.short_id, shorts.user_id, shorts.short_path, users.username, users.profile_path
    FROM shorts
    JOIN users ON shorts.user_id = users.user_id
    ORDER BY shorts.created_at DESC
  `;

  dbPool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }

    res.json(results.rows);
  });
});

//feed post
app.get("/posts", (req, res) => {
  const query = `
    SELECT 
      posts.post_id, 
      posts.user_id, 
      posts.content, 
      posts.likes, 
      posts.created_at,
      posts.post_path,
      users.username,
      users.profile_path
    FROM 
      posts
    JOIN 
      users 
    ON 
      posts.user_id = users.user_id
  `;

  dbPool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }

    const formattedResults = results.rows.map((post) => {
      return {
        ...post,
        created_at: formatDistanceToNow(new Date(post.created_at), {
          addSuffix: true,
        }),
      };
    });

    res.json(formattedResults);
  });
});

//shorts upload
const pstorage = multer.diskStorage({
  destination: path.join(__dirname, "../site/public/shorts"),
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const pupload = multer({ storage: pstorage });

app.post("/upload", pupload.array("videos"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id;

    const filesData = req.files.map((file) => {
      return {
        user_id: userId,
        short_path: "/shorts/" + file.filename,
        content: file.originalname,
      };
    });

    const insertShortsQuery = `
        INSERT INTO shorts (user_id, short_path, content)
        VALUES ($1, $2, $3);
      `;

    for (const data of filesData) {
      await dbPool.query(insertShortsQuery, [
        data.user_id,
        data.short_path,
        data.content,
      ]);
    }

    res.status(200).send("Files uploaded successfully.");
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("Failed to upload files.");
  }
});

//story upload
const customStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../site/public/story");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".").pop());
  },
});

const supload = multer({ storage: customStorage });

app.post("/supload", supload.array("files"), async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const fileNames = req.files.map((file) => file.filename);
    const storyPaths = fileNames
      .map((fileName) => "/story/" + fileName)
      .join(", ");

    const insertShortsQuery = `
        INSERT INTO story (user_id, story_path)
        VALUES ($1, $2)
      `;

    await dbPool.query(insertShortsQuery, [userId, storyPaths]);

    res.status(200).send("Files uploaded and saved successfully");
  } catch (error) {
    console.error("Error uploading files:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send("Invalid token");
    } else {
      res.status(500).send("Failed to upload files.");
    }
  }
});

//upload / edit profile
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../site/public/img"),
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage: storage });
app.post("/updateProfile", upload.single("photos"), async (req, res) => {
  try {
    const { username, name, bio } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id;

    let profilePicturePath = null;
    if (req.file) {
      profilePicturePath = `/img/${req.file.filename}`;
    }

    let updateQuery;
    let queryParams;

    if (profilePicturePath) {
      updateQuery = `
          UPDATE users
          SET username = $1, full_name = $2, bio = $3, profile_path = $4
          WHERE user_id = $5;
        `;
      queryParams = [username, name, bio, profilePicturePath, userId];
    } else {
      updateQuery = `
          UPDATE users
          SET username = $1, full_name = $2, bio = $3
          WHERE user_id = $4;
        `;
      queryParams = [username, name, bio, userId];
    }

    await dbPool.query(updateQuery, queryParams);

    res.status(200).send("Profile updated successfully.");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Failed to update profile.");
  }
});

//post
const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../site/public/post");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const postupload = multer({ storage: postStorage });

app.post("/postupload", postupload.array("files"), async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const fileNames = req.files
      .map((file) => "/post/" + file.filename)
      .join(",");
    const descriptions = req.body.descriptions;

    const client = await dbPool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "INSERT INTO posts (user_id, content, post_path) VALUES ($1, $2, $3)",
        [userId, descriptions, fileNames]
      );

      await client.query("COMMIT");
      res.status(200).send("Files uploaded and saved successfully");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error saving files to the database:", err);
      res.status(500).send("Failed to upload files.");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send("Invalid token");
    } else {
      res.status(500).send("Failed to upload files.");
    }
  }
});

//follower list
app.get("/followerlist", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.user_id;
    const getUserInfoQuery = `
      SELECT 
        users.user_id,
        users.username, 
        users.profile_path,
        CASE 
          WHEN following.following_id IS NOT NULL THEN true 
          ELSE false 
        END AS followed
      FROM followers
      INNER JOIN users ON followers.follower_id = users.user_id
      LEFT JOIN following ON followers.follower_id = following.following_id AND following.user_id = $1
      WHERE followers.user_id = $1;
    `;
    const result = await dbPool.query(getUserInfoQuery, [userId]);

    if (result.rows.length > 0) {
      const followersData = result.rows.map((row) => ({
        user_id: row.user_id,
        username: row.username,
        profile_path: row.profile_path,
        followed: row.followed,
      }));
      res.json({ followers: followersData });
    } else {
      res.status(404).json({ error: "No followers found for the user" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

//following list
app.get("/followinglist", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.user_id;
    const getUserInfoQuery = `
      SELECT 
        users.user_id,
        users.username, 
        users.profile_path,
        CASE 
          WHEN followers.follower_id IS NOT NULL THEN true 
          ELSE false 
        END AS followed
      FROM following
      INNER JOIN users ON following.following_id = users.user_id
      LEFT JOIN followers ON following.following_id = followers.follower_id AND followers.user_id = $1
      WHERE following.user_id = $1;
    `;
    const result = await dbPool.query(getUserInfoQuery, [userId]);

    if (result.rows.length > 0) {
      const followingData = result.rows.map((row) => ({
        user_id: row.user_id,
        username: row.username,
        profile_path: row.profile_path,
        followed: row.followed,
      }));
      res.json({ following: followingData });
    } else {
      res.status(404).json({ error: "No followers found for the user" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.post("/startchat", async (req, res) => {
  const { friendId } = req.body;
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id;

    // Check if a row already exists with the same userId and friendId
    const checkMessengerQuery = `
      SELECT * FROM messengers 
      WHERE user_id = $1 AND friend_id = $2;
    `;
    const checkValues = [userId, friendId];
    const { rows } = await dbPool.query(checkMessengerQuery, checkValues);

    if (rows.length > 0) {
      // If a row already exists, return success without inserting a new row
      return res.status(200).json({ success: true });
    }

    // If no such row exists, insert a new row into the messengers table
    const insertMessengerQuery = `
      INSERT INTO messengers (user_id, friend_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const insertValues = [userId, friendId];
    await dbPool.query(insertMessengerQuery, insertValues);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ success: false, error: "Failed to start chat" });
  }
});

//friend list
app.get("/friends", async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.user_id;

    // Query to fetch all friend's information from messengers table for the given user_id
    const getFriendInfoQuery = `
      SELECT m.friend_id, u.username, u.profile_path, u.full_name 
      FROM messengers m
      LEFT JOIN users u ON m.friend_id = u.user_id
      WHERE m.user_id = $1;
    `;
    const result = await dbPool.query(getFriendInfoQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No friends found" });
    }

    // Mapping all friends found
    const friends = result.rows.map((row) => ({
      friend_id: row.friend_id,
      username: row.username,
      profile_path: row.profile_path,
      full_name: row.full_name,
    }));

    res.json({ friends });
  } catch (error) {
    console.error("Error fetching friend data:", error);
    res.status(500).json({ error: "Failed to fetch friend data" });
  }
});

app.post("/followunfollow", async (req, res) => {
  const { friendId } = req.body;
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id;

    // Check if a row already exists with the same userId and followingId
    const checkMessengerQuery = `
      SELECT * FROM messengers 
      WHERE user_id = $1 AND following_id = $2;
    `;
    const checkValues = [userId, friendId];
    const { rows } = await dbPool.query(checkMessengerQuery, checkValues);

    if (rows.length > 0) {
      // If a row already exists, return success without inserting a new row
      return res.status(200).json({ success: true });
    }

    // If no such row exists, insert a new row into the messengers table
    const insertMessengerQuery = `
      INSERT INTO following (user_id, following_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const insertValues = [userId, friendId];
    await dbPool.query(insertMessengerQuery, insertValues);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ success: false, error: "Failed to start chat" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
