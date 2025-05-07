import React from 'react';

const Logo = ({ size = 'text-3xl', color = 'text-gray-800' }) => {
  return (
    <span className={`font-bold ${size} ${color} tracking-wide`}>
      JuteCart
    </span>
  );
};

export default Logo;
