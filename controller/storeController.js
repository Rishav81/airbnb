const fs = require("fs");
const Home = require("../model/home");
const User = require("../model/user");

exports.getIndex = async (req, res, next) => {
  try {
    // ------------------------------
    // Locations and Destinations
    // ------------------------------
    const locations = [
      "Delhi",
      "Mumbai",
      "Goa",
      "Jaipur",
      "Manali",
      "Udaipur",
      "Hyderabad",
    ];
    const destinations = [
      "Mountain",
      "Beach",
      "Farmhouse",
      "Villa",
      "City",
      "Luxury",
    ];

    // ✅ Default Location Images (optimized width 1200px)
    const defaultLocationImages = {
      Delhi:
        "https://plus.unsplash.com/premium_photo-1697729555861-e406b4989ee1?q=80&w=1200&auto=format&fit=crop",
      Mumbai:
        "https://images.unsplash.com/photo-1580581096469-8afb38d3dbd5?q=80&w=1200&auto=format&fit=crop",
      Goa: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1200&auto=format&fit=crop",
      Jaipur:
        "https://plus.unsplash.com/premium_photo-1697730476229-b536fd6e88be?q=80&w=1200&auto=format&fit=crop",
      Manali:
        "https://images.unsplash.com/photo-1594102552386-793e5a27ad10?q=80&w=1200&auto=format&fit=crop",
      Udaipur:
        "https://images.unsplash.com/photo-1695956353120-54ce5e91632b?q=80&w=1200&auto=format&fit=crop",
      Hyderabad:
        "https://images.unsplash.com/photo-1741545979534-02f59c742730?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };

    // ✅ Default Destination Images (optimized width 1200px)
    const defaultDestinationImages = {
      Mountain:
        "https://plus.unsplash.com/premium_photo-1676464927572-045026d2a4bd?q=80&w=1200&auto=format&fit=crop",
      Beach:
        "https://images.unsplash.com/photo-1605010169710-e02d210439b0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      Farmhouse:
        "https://plus.unsplash.com/premium_photo-1694475477920-8064c7783ed9?q=80&w=1200&auto=format&fit=crop",
      Villa:
        "https://images.unsplash.com/photo-1723110994499-df46435aa4b3?q=80&w=1200&auto=format&fit=crop",
      City: "https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?q=80&w=1200&auto=format&fit=crop",
      Luxury:
        "https://images.unsplash.com/photo-1571635685743-db0db8e31d9a?q=80&w=1200&auto=format&fit=crop",
    };

    // ------------------------------
    // Parallel Database Queries
    // ------------------------------
    const [topHomes, newlyAddedHomes, homeAggregate, destinationAggregate] =
      await Promise.all([
        Home.find().sort({ houseRating: -1 }).limit(20).lean(),
        Home.find().sort({ createdAt: -1 }).limit(20).lean(),
        Home.aggregate([
          {
            $group: { _id: { $toLower: "$houseLocation" }, count: { $sum: 1 } },
          },
        ]),
        Home.aggregate([
          {
            $group: {
              _id: { $toLower: "$destinationType" },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    // ------------------------------
    // Map Counts to Locations
    // ------------------------------
    const locationCounts = {};
    const locationImages = {};
    locations.forEach((loc) => {
      locationCounts[loc] = 0;
      locationImages[loc] = defaultLocationImages[loc];
    });

    homeAggregate.forEach((home) => {
      if (!home._id) return;

      const lowerLocation = home._id.toLowerCase();

      const match = locations.find((city) =>
        lowerLocation.includes(city.toLowerCase()),
      );

      if (match) {
        locationCounts[match] += home.count;
      }
    });

    // ------------------------------
    // Map Counts to Destinations
    // ------------------------------
    const destinationCounts = {};
    const destinationImages = {};
    destinations.forEach((dest) => {
      destinationCounts[dest] = 0;
      destinationImages[dest] = defaultDestinationImages[dest];
    });

    destinationAggregate.forEach((home) => {
      if (!home._id) return;
      const key = home._id.trim().toLowerCase();
      const match = destinations.find((d) => d.toLowerCase() === key);
      if (match) {
        destinationCounts[match] = home.count;
      }
    });
    // City Sections (keep your existing code)
    const delhiHomes = await Home.find({
      houseLocation: { $regex: /delhi/i },
    }).limit(20);

    const mumbaiHomes = await Home.find({
      houseLocation: { $regex: /mumbai/i },
    }).limit(20);

    const goaHomes = await Home.find({
      houseLocation: { $regex: /goa/i },
    }).limit(20);

    const jaipurHomes = await Home.find({
      houseLocation: { $regex: /jaipur/i },
    }).limit(20);

    const manaliHomes = await Home.find({
      houseLocation: { $regex: /manali/i },
    }).limit(20);

    const udaipurHomes = await Home.find({
      houseLocation: { $regex: /udaipur/i },
    }).limit(20);

    const hyderabadHomes = await Home.find({
      houseLocation: { $regex: /hyderabad/i },
    }).limit(20);

    // ------------------------------
    // Render Homepage
    // ------------------------------
    res.render("store/index", {
      pageTitle: "Airbnb Home",
      currentPage: "Home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
      role: req.session.user ? req.session.user.role : "guest",

      locations,
      locationCounts,
      locationImages,

      destinations,
      destinationCounts,
      destinationImages,

      topHomes,
      newlyAddedHomes,

      delhiHomes,
      mumbaiHomes,
      goaHomes,
      jaipurHomes,
      manaliHomes,
      udaipurHomes,
      hyderabadHomes,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getHomesList = async (req, res) => {
  try {
    const { location } = req.query;

    let homes;

    // 🔍 Location Filtering (MongoDB level)
    if (location && location !== "all") {
      homes = await Home.find({
        houseLocation: {
          $regex: location,
          $options: "i",
        },
      });
    } else {
      homes = await Home.find().lean();
    }

    let favIds = [];

    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      favIds = user.favourites.map((id) => id.toString());
    }

    res.render("store/home-list", {
      registeredHomes: homes,
      favouriteIds: favIds,
      isLoggedIn: req.session.isLoggedIn,
      pageTitle: "Home List",
      currentPage: "Home-List",
      user: req.session.user,
      location: location,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading homes");
  }
};

exports.getFavouriteList = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const userFav = await User.findById(userId).populate("favourites");

    res.render("store/favourite-list", {
      pageTitle: "My Favourite",
      currentPage: "Favourite",
      registeredHomes: userFav.favourites,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading favourites");
  }
};

exports.postToggleFavourite = async (req, res) => {
  try {
    const userId = req.session.user._id; //logged in user
    const homeId = req.params.homeId; //home being clicked

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if already in favourites
    const existing = user.favourites.some((fav) => fav.toString() === homeId);

    if (existing) {
      // Remove favourite
      user.favourites = user.favourites.filter(
        (fav) => fav.toString() !== homeId,
      );
      await user.save();
      return res.json({ isFavourite: false });
    } else {
      // Add to favourites
      user.favourites.push(homeId);
      await user.save();
      return res.json({ isFavourite: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.postRemoveFavourite = async (req, res) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  user.favourites = user.favourites.filter((fav) => fav.toString() !== homeId);
  await user.save();

  res.redirect("/favourite-list");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId).then((homes) => {
    const home = homes;
    if (home) {
      res.render("store/home-detail", {
        home: home, //passing house in page
        pageTitle: "Home Details",
        currentPage: "Home-List",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    } else {
      res.redirect("/home-list");
    }
  });
};
