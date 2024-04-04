const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); // Import the cors middleware
// const { default: Stripe } = require('stripe');
const stripe = require('stripe')('YOUR_API_KEY')
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/carecatalyst', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a Mongoose schema
const fundraiserSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    by: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
    },
    dayleft: {
      type: String,
      required: true,
    },
    support: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    a: {
      type: Number,
      required: true,
    },
    t: {
      type: Number,
      required: true,
    },
  });

// Create a Mongoose model
const Item = mongoose.model('fundraisers', fundraiserSchema);

app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(cors()); 

// CRUD operations
app.post('/items', upload.any(), async (req, res) => {
  try {
    console.log("Received new Request", req.body);
    const newItem = new Item({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      image: req.body.image,
      by: req.body.by,
      a: req.body.amount,
      t: req.body.target,
      amount: new Intl.NumberFormat('en-IN', {style:'currency', currency:"INR"}).format(req.body.amount),
      target: new Intl.NumberFormat('en-IN', {style:'currency', currency:"INR"}).format(req.body.target),
      dayleft: req.body.dayleft,
      support: Math.floor(Math.random()*1000).toString(),
      type: req.body.type // Assuming 'type' is the new field for campaign type
    });
    await newItem.save();
    res.status(201).send(newItem);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/checkout-session', async (req, res)=>{
  try {
    const session = await stripe.checkout.sessions.create({
      customer: 'cus_PqPOGBC3QE8Xuj',
      payment_method_types: ["card"],
      mode: "payment",
      line_items:[{
        price:"price_1P0ictSHbBcqBAz5vlox50vX",
        quantity: 1,
      }],
      success_url: `http://localhost:3000/success.html`,
    cancel_url: `http://localhost:3000/cancel.html`,
    })
    res.send({id:session.id});
  } catch (err) {
    console.log(err);

  }
})

app.get('/items/:type', async (req, res) => {
  try {
    const item = await Item.find({type:req.params.type});
    res.send(item);
  } catch (err) {
    res.status(404).send('Items not found');
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(item);
  } catch (err) {
    res.status(404).send('Item not found');
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.send('Item deleted successfully');
  } catch (err) {
    console.log(err);
    res.status(404).send('Item not found');
  }
});

app.use("/", express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

