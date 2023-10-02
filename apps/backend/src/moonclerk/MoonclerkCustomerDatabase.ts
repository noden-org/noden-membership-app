import needle from 'needle';
import { MoonclerkCustomer } from './types';

export default class MoonclerkCustomerDatabase {
  // map from email to membership status
  private customers: { [email: string]: MoonclerkCustomer } = {};

  // stores when the database was last refreshed
  private lastRefresh: Date | undefined;
  public isRefreshing: boolean = false;

  private async loadCustomers(count: number, offset: number): Promise<MoonclerkCustomer[]> {
    console.log(`Loading ${count} customers from Moonclerk from offset ${offset}...`);
    const apiRes = await needle('get', `https://api.moonclerk.com/customers?count=${count}&offset=${offset}`, {
      headers: {
        Authorization: `Token token=${process.env.MOONCLERK_API_KEY}`,
        Accept: 'application/vnd.moonclerk+json;version=1',
      },
    });
    console.log(`Loaded ${apiRes.body.customers.length} customers from Moonclerk from offset ${offset}`);
    return apiRes.body.customers;
  }

  private async loadAllCustomers(): Promise<MoonclerkCustomer[]> {
    let customers: MoonclerkCustomer[] = [];
    let offset = 0;

    while (true) {
      const newCustomers = await this.loadCustomers(100, offset);
      if (newCustomers.length === 0) break;
      customers = customers.concat(newCustomers);
      offset += 100;
    }

    return customers;
  }

  needsRefresh() {
    return !this.lastRefresh || +new Date() - +this.lastRefresh > 24 * 60 * 60 * 1000;
  }

  async refresh() {
    if (this.needsRefresh()) {
      if (this.isRefreshing) {
        console.log('Waiting for Moonclerk customer database to finish refreshing...');
        while (this.isRefreshing) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
      }
      console.log(
        'Refreshing Moonclerk customer database because it is stale (last refresh: ' +
          this.lastRefresh?.toISOString() +
          ')',
      );

      this.isRefreshing = true;
      const newCustomers = await this.loadAllCustomers();
      this.customers = {};

      for (const customer of newCustomers) {
        const email = customer.email.toLowerCase();

        if (this.customers[email] && this.customers[email]?.id !== customer.id) {
          if (this.customers[email].subscription.status === 'active' && customer.subscription.status === 'active') {
            console.warn(
              `WARNING: More than one active subscription for customer email ${email} with different IDs: ${this.customers[email].id} and ${customer.id}`,
            );
          }

          if (customer.subscription.status !== 'active') {
            // one email address can have multiple subscriptions, but always prioritize the active one
            continue;
          }
        }

        this.customers[email] = customer;
      }
      this.isRefreshing = false;

      this.lastRefresh = new Date();
    }
  }

  async getMembershipStatus(email: string): Promise<MoonclerkCustomer | undefined> {
    await this.refresh();
    return this.customers[email.toLowerCase()];
  }
}
