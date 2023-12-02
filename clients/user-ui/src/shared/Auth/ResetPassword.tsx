'use client';

import styles from '@/src/utils/style';
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { RESET_PASSWORD } from '@/src/graphql/actions/resetPassword.action';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long!'),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Passwords must need to match!',
      path: ['confirmPassword'],
    }
  );

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({
  activationToken,
}: {
  activationToken: string | string[];
}) => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [show, setShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const res = await resetPassword({
        variables: {
          password: data.password,
          activationToken: activationToken,
        },
      });
      console.log('res', res);
      if (res.data.resetPassword.user) {
        toast.success('Password reset successfully!');
        reset();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="md:w-[500px] w-full">
        <h1 className={styles.title}>Reset Your Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mb-3">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your password
            </label>
            <div className="w-full relative">
              <input
                {...register('password')}
                type={show ? 'text' : 'password'}
                placeholder="password!@%"
                className={`${styles.input}`}
              />
              {show ? (
                <AiOutlineEye
                  className="absolute bottom-3 right-2 z-[1] cursor-pointer select-none"
                  size={20}
                  onClick={() => setShow(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute bottom-3 right-2 z-[1] cursor-pointer select-none"
                  size={20}
                  onClick={() => setShow(true)}
                />
              )}
            </div>

            {errors.password && (
              <span className="text-red-500 block mt-1">{`${errors.password.message}`}</span>
            )}
          </div>
          <div className="w-full mb-3">
            <label htmlFor="confirmPassword" className={`${styles.label}`}>
              Enter your confirm password again
            </label>
            <div className="w-full relative">
              <input
                {...register('confirmPassword')}
                type={confirmPasswordShow ? 'text' : 'password'}
                placeholder="password!@%"
                className={`${styles.input}`}
              />
              {confirmPasswordShow ? (
                <AiOutlineEye
                  className="absolute bottom-3 right-2 z-[1] cursor-pointer select-none"
                  size={20}
                  onClick={() => setConfirmPasswordShow(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute bottom-3 right-2 z-[1] cursor-pointer select-none"
                  size={20}
                  onClick={() => setConfirmPasswordShow(true)}
                />
              )}
            </div>

            {errors.confirmPassword && (
              <span className="text-red-500 block mt-1">{`${errors.confirmPassword.message}`}</span>
            )}
          </div>
          <div className="w-full mt-5">
            <input
              type="submit"
              value="Submit"
              disabled={isSubmitting || loading}
              className={`${styles.button} mt-3`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
