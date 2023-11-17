import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Link from "./models/Link.js";
dotenv.config();

const app = express();

app.use(express.json()); // middle express

const PORT = process.env.PORT || 8080; // port number

const connDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_DB_URI);
  if (conn) {
    console.log(`MongoDB Connected`);
  }
};


app.post("/api/links", async (req, res) => {
  const { url, slug } = req.body;

  const randomSlug = Math.random().toString(36).substring(2, 7);

  const link = new Link({
    url: url,
    slug: slug || randomSlug,
  });

  try {
    const savedLink = await link.save();

    return res.json({
      success: true,
      data: {
        shortUrl: `${process.env.BASE_URL}/api/${savedLink.slug}`,
      },
      message: "Link saved successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/api/:slug", async (req, res)=>{
  const {slug} = req.params;

  const link = await Link.findOne({slug: slug});

  if(!link){
    return res.json({
      success: false,
      message: "Link not found"
    })
  }

  await Link.updateOne({slug: slug}, {$set: {
    clicks: link.clicks + 1
  }})

  res.redirect(link.url);
})


app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
  connDB();
});
