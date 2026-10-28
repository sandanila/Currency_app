import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

//all currencys
app.get("/getAllCurrencies", async (req, res) => {
  const nameURL = "https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false&app_id=••••";

  try {
    const namesResponse = await axios.get(nameURL);
    const nameData = namesResponse.data;

    return res.json(nameData);
  } catch (err) {
    console.error(err);
  }
});

//get the target amount
app.get("/convert", async(req, res) => {
  const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } = req.query;

  try {
    const dataUrl = `https://openexchangerates.org/api/historical/${date}.json?app_id=50aa15fa00d441ada2c93aab85f2a746`;

    const dataResponse = await axios.get(dataUrl);
    const rates = dataResponse.data.rates;

    //rates
    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    //final target val
    const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

    return res.json(targetAmount.toFixed(2));
  } catch (err) {
    console.error(err);
  }
});

//listen to port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});
