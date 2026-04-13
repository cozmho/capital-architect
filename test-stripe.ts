import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe("mk_1TIWyHD8lvIS7A5L7DJ4gUUy", {
  apiVersion: "2026-03-25.dahlia" as any,
});

async function main() {
  try {
    const res = await stripe.balance.retrieve();
    console.log("Success! Balance:", res);
  } catch (e) {
    console.error("Error:", (e as any).message);
  }
}
main();
