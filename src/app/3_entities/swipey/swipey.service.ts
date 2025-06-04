import { Logger } from "../../../lib/logger";

export class SwipeyService {
  private readonly logger = new Logger({ prefix: "SwipeyService" });
  // constructor(
  //     private readonly logger: Logger
  // ) {}
  async getPaymentMethods() {
    try {
      const res = await fetch(`/api/swipey/payment-methods`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Authorization: `Bearer ${process.env.SWIPEY_API_KEY}`,
        },
        //   body: JSON.stringify({
        //     amount: 1,
        //     currency: "USD",
        //     success_url: "https://swipey.ai",
        //     cancel_url: "https://swipey.ai",
        //   })
      });
      this.logger.debug(res);
      const data = await res.json();
      this.logger.warn(data);
      return data;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
