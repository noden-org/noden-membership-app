'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import { useQuery } from '@tanstack/react-query';
import { notification, QRCode } from 'antd';
import isEmail from 'validator/es/lib/isEmail';

import { getConfig } from './config';
import styles from './MembershipChecker.module.css';

function useMembershipByEmail(email: string): any {
  const queryResult = useQuery({
    queryKey: ['membership', email],
    queryFn: async () => {
      if (!email || typeof email !== 'string' || !isEmail(email)) return null;
      const response = await fetch(getConfig().apiRoot + `/membership?` + new URLSearchParams({ email }).toString());
      return await response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (queryResult.error || queryResult.data?.error) {
      notification.error({
        message: 'Error',
        description: 'There was an error checking your membership. Please try again later.',
      });
    }
  }, [queryResult.error, queryResult.data?.error]);

  return queryResult;
}

export default function MembershipChecker() {
  const emailFromQuery =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('email') ?? '' : '';
  const x = 1;

  const [email, setEmail] = useState(emailFromQuery);
  const [emailDebounced, setEmailDebounced] = useState('');
  const debounceEmail = useRef(debounce(email => setEmailDebounced(email), 500)).current;

  const membership = useMembershipByEmail(emailDebounced);

  useEffect(() => {
    debounceEmail(email);

    // Update URL query string with email
    if (typeof window !== 'undefined' && isEmail(email)) {
      const url = new URL(window.location.href);
      url.searchParams.set('email', email);
      window.history.replaceState({}, '', url.toString());
    }
  }, [email]);

  return (
    <>
      <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <b>Hey there! </b>Enter your email address to check your membership. You can bookmark this page for easier
        checking next time.
      </p>

      <Input.Search
        type="email"
        placeholder="amazing.soul@noden.org"
        value={email}
        onChange={e => setEmail(e.target.value)}
        loading={membership.isFetching}
        style={{ marginBottom: '1.5rem' }}
      />

      {membership?.data && !membership?.data?.error ? (
        <>
          <span
            style={{ backgroundColor: membership.data.status === 'active' ? 'green' : 'red' }}
            className={styles.statusLabel}
          >
            {
              ({ active: 'active', canceled: 'canceled', unpaid: 'unpaid', 'not-a-member': 'not a member' } as any)[
                membership.data.status
              ]
            }
          </span>

          {membership.data.status === 'active' ? (
            <QRCode
              value={'https://membership.noden.org/?' + new URLSearchParams({ email: emailDebounced }).toString()}
              style={{ alignSelf: 'center', marginBottom: '1rem' }}
              size={256}
            />
          ) : null}

          {membership.data.status === 'not-a-member' ? (
            <Link href="https://www.noden.org/membership" target="_blank" className={styles.manageMembershipLink}>
              Click here to become a member now!
            </Link>
          ) : null}

          {membership.data.management_url ? (
            <Link href={membership.data.management_url} target="_blank" className={styles.manageMembershipLink}>
              Manage membership
            </Link>
          ) : null}
        </>
      ) : null}
    </>
  );
}
