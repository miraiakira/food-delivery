import styles from '@/src/utils/style';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveState } from '@/src/types/auth';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '@/src/graphql/actions/forgotPassword.action';
import toast from 'react-hot-toast';

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: Dispatch<SetStateAction<ActiveState>>;
}) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const res = await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      if (res.data.forgotPassword.message) {
        toast.success(res.data.forgotPassword.message);
      }
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <div>
      <h1 className={styles.title}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative mt-5 mb-3">
          <label className={`${styles.label}`}>Enter your email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="loginmail@gmail.com"
            className={`${styles.input}`}
          />
          {errors.email && (
            <span className="text-red-500 block mt-1">{`${errors.email.message}`}</span>
          )}
        </div>
        <div className="w-full mt-10">
          <input
            type="submit"
            value="Submit"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back to
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState(ActiveState.Login)}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;
