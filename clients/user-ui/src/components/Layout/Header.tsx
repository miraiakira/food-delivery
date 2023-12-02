import React from 'react';
import NavItems from '../NavItems';
import ProfileDropDown from '../ProfileDropDown';

import styles from '@/src/utils/style';

const Header = () => {
  return (
    <header className="w-full bg-[#0F1524] ">
      <div className="w-[90%] mx-auto  h-[80px] flex items-center justify-between">
        <h1 className={styles.logo}>炒饭</h1>
        <NavItems />
        <ProfileDropDown />
      </div>
    </header>
  );
};

export default Header;
