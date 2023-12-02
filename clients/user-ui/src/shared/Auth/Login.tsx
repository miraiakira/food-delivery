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
import { LOGIN_USER } from '@/src/graphql/actions/login.action';
import toast from 'react-hot-toast';
import cookies from 'js-cookie';
import { signIn } from 'next-auth/react';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long!'),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: Dispatch<SetStateAction<ActiveState>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loginUser, { loading }] = useMutation(LOGIN_USER);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const loginData = { email: data.email, password: data.password };
      const res = await loginUser({
        variables: loginData,
      });
      if (res.data.login.user) {
        toast.success('Login Successfully!');
        cookies.set('access_token', res.data.login.accessToken);
        cookies.set('refresh_token', res.data.login.refreshToken);
        reset();
        setOpen(false);
        window.location.reload();
      } else {
        toast.error(res.data.login.error.message);
      }
    } catch (err: any) {
      toast.success(err.message);
    }
  };
  return (
    <div>
      <h1 className={styles.title}>Login with Chaofan</h1>
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
        <div className="w-full mt-5">
          <span
            className={`${styles.label} pt-2 !text-[#2190ff] block text-right cursor-pointer select-none`}
            onClick={() => setActiveState(ActiveState.Forget)}
          >
            Forgot your password?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle
            onClick={() => signIn()}
            size={30}
            className="cursor-pointer mr-2"
          />
          {/* <AiFillGithub size={30} className="cursor-pointer ml-2" /> */}
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Not have any account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState(ActiveState.Signup)}
          >
            Sign up
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Login;
