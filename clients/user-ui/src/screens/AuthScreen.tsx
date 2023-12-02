import React, { Dispatch, SetStateAction, useState } from 'react';
import Login from '../shared/Auth/Login';
import Signup from '../shared/Auth/Signup';
import { ActiveState } from '../types/auth';
import Verification from '../shared/Auth/Verification';
import ForgotPassword from '../shared/Auth/ForgotPassword';

const AuthScreen = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [activeState, setActiveState] = useState<ActiveState>(
    ActiveState.Login
  );
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.id === 'screen') {
      setOpen(false);
    }
  };
  return (
    <div
      className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#00000032]"
      id="screen"
      onClick={handleClose}
    >
      <div className="w-[450px] bg-slate-900 rounded shadow-sm py-3 px-6">
        {activeState === ActiveState.Login && (
          <Login setActiveState={setActiveState} setOpen={setOpen} />
        )}
        {activeState === ActiveState.Signup && (
          <Signup setActiveState={setActiveState} />
        )}
        {activeState === ActiveState.Verify && (
          <Verification setActiveState={setActiveState} />
        )}
        {activeState === ActiveState.Forget && (
          <ForgotPassword setActiveState={setActiveState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
