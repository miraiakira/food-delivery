import ResetPassword from '@/src/shared/Auth/ResetPassword';
import React from 'react';

const ResetPasswordPage = ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const activationToken = searchParams['verify'] ?? '';

  console.log('activationToken', activationToken);
  return <ResetPassword activationToken={activationToken} />;
};

export default ResetPasswordPage;
