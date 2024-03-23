'use client'

import MotoSvg from '@/public/moto.svg';
import Image from 'next/image'

const Moto = () => {
  return (
    <div>
      <Image  src={MotoSvg} alt='' priority={true} loading='eager' width={150} height={150}/>
    </div>
  );
};

export default Moto;