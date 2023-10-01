import express from 'express';
import validator from 'validator';
import MoonclerkCustomerDatabase from './moonclerk/MoonclerkCustomerDatabase';
import { MoonclerkSubscriptionStatus } from './moonclerk/types';

const router = express.Router();
const moonclerkCustomerDatabase = new MoonclerkCustomerDatabase();

type MembershipResponse =
  | { isNotAMember: true }
  | {
      id?: number;
      management_url?: string;
      status: MoonclerkSubscriptionStatus | 'not-a-member';
    };

router.get('/membership', async (req, res) => {
  if (!req.query.email || !validator.isEmail(req.query.email as string)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  try {
    const status = await moonclerkCustomerDatabase.getMembershipStatus(req.query.email as string);
    if (!status) {
      res.status(200).json({ status: 'not-a-member' });
      return;
    }

    const response: MembershipResponse = {
      id: status.id,
      management_url: status.management_url,
      status: status.subscription.status,
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/health', async (req, res) => {
  if (moonclerkCustomerDatabase.needsRefresh()) {
    // note: do not await here, we want to return immediately
    moonclerkCustomerDatabase.refresh();

    // return HTTP status to indicate that the database is stale
    res.status(503).json({ error: 'Moonclerk customer database is stale' });
    return;
  }

  res.status(200).json({ status: 'ok' });
});

export default router;
