import styles from '@/src/utils/style';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { ActiveState } from '@/src/types/auth';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '@/src/graphql/actions/register.actions';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long!'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long!'),
  phone_number: z
    .number()
    .min(11, 'Phone number must be at least 11 characters!'),
});

type SignupSchema = z.infer<typeof formSchema>;

const Signup = ({
  setActiveState,
}: {
  setActiveState: Dispatch<SetStateAction<ActiveState>>;
}) => {
  const [registerUserMutation, { loading, error, data }] =
    useMutation(REGISTER_USER);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      const response = await registerUserMutation({
        variables: data,
      });
      localStorage.setItem(
        'activation_token',
        response.data.register.activation_token
      );
      toast.success('Please check your email to activate your account!');
      reset();
      setActiveState(ActiveState.Verify);
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <div>
      <h1 className={styles.title}>Signup with Chaofan</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mt-5 relative mb-3">
          <label className={`${styles.label}`}>Enter your name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="enter your name..."
            className={`${styles.input}`}
          />
          {errors.name && (
            <span className="text-red-500 block mt-1">{`${errors.name.message}`}</span>
          )}
        </div>
        <div className="w-full relative mb-3">
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
        <div className="w-full relative mb-3">
          <label className={`${styles.label}`}>Enter your phone number</label>
          <input
            {...register('phone_number', { valueAsNumber: true })}
            type="number"
            placeholder="enter your phone number"
            className={`${styles.input}`}
          />
          {errors.phone_number && (
            <span className="text-red-500 block mt-1">{`${errors.phone_number.message}`}</span>
          )}
        </div>
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
                onClick={() => {
                  console.log('clicked');
                  setShow(false);
                }}
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
        <br />
        <div className="w-full mt-5">
          <input
            type="submit"
            value="Sign Up"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account?
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

export default Signup;
