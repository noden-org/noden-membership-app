'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import { useQuery } from '@tanstack/react-query';
import { notification, Tag, QRCode } from 'antd';
import isEmail from 'validator/es/lib/isEmail';

import { getConfig } from './config';

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
  const [email, setEmail] = useState('');
  const [emailDebounced, setEmailDebounced] = useState('');
  const debounceEmail = useRef(debounce(email => setEmailDebounced(email), 500)).current;

  const membership = useMembershipByEmail(emailDebounced);

  useEffect(() => {
    debounceEmail(email);
  }, [email]);

  return (
    <>
      <Input.Search
        type="email"
        placeholder="amazing.soul@noden.org"
        value={email}
        onChange={e => setEmail(e.target.value)}
        loading={membership.isFetching}
        style={{ marginBottom: '1rem' }}
      />

      {membership?.data && !membership?.data?.error ? (
        <>
          <p style={{ marginBottom: '1rem' }}>
            Membership status of <b>{emailDebounced}</b>:{' '}
            <Tag color={membership.data.status === 'active' ? 'green' : 'red'}>{membership.data.status}</Tag>
          </p>

          {membership.data.status === 'active' ? (
            <>
              <p style={{ marginBottom: '1rem' }}>Show this QR code to the workshop leader to check in:</p>
              <QRCode value={emailDebounced} style={{ alignSelf: 'center', marginBottom: '1rem' }} />
            </>
          ) : null}

          {membership.data.status === 'not-a-member' ? (
            <p style={{ marginBottom: '1rem' }}>
              <Link href="https://www.noden.org/membership" target="_blank">
                Click here to become a member now!
              </Link>
            </p>
          ) : null}

          {membership.data.management_url ? (
            <p style={{ marginBottom: '1rem' }}>
              <Link href={membership.data.management_url} target="_blank">
                Click here to manage your membership.
              </Link>
            </p>
          ) : null}
        </>
      ) : null}
    </>
  );
}
