const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MONGO CONNECTION SUCCESSFULL");
  })
  .catch(() => {
    console.log("MONGO CONNECTION ERROR");
  });
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

// console.log(descriptors, places, cities);

const getRand = () => Math.floor(Math.random() * 50);
const getRandElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

async function seedData() {
  await Campground.deleteMany({});
  for (let i = 0; i < 350; i++) {
    let rand = getRand();
    const camp = new Campground({
      author: "68b8420ad09fe39a0f6ee39c",
      location: `${cities[rand].city}, ${cities[rand].state}`,
      name: `${getRandElement(descriptors)} ${getRandElement(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[rand].longitude, cities[rand].latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/djidgtahl/image/upload/v1765262291/YelpCamp/jvdybgroyrxjudwhljal.jpg",
          filename: "YelpCamp/jvdybgroyrxjudwhljal",
        },
        {
          url: "https://res.cloudinary.com/djidgtahl/image/upload/v1765262293/YelpCamp/fnplwrk4gn1z9mvydfkr.jpg",
          filename: "YelpCamp/fnplwrk4gn1z9mvydfkr",
        },
      ],

      price: Math.random() * 20,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci dignissimos in voluptas soluta eum veritatis. Sit doloribus possimus dolorem facere aliquam enim nesciunt ducimus id minima, alias eaque, cum velit?",
    });
    await camp.save();
  }
}

seedData().then(() => {
  mongoose.connection.close();
});
